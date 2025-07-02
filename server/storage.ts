import {
  properties,
  leads,
  admins,
  type Property,
  type InsertProperty,
  type Lead,
  type InsertLead,
  type Admin,
  type InsertAdmin,
  type PropertySearchParams,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, gte, lte, ilike, desc, asc, sql, count } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Property operations
  getProperties(params: PropertySearchParams): Promise<{ properties: Property[]; total: number }>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  incrementPropertyViews(id: number): Promise<void>;

  // Lead operations
  getLeads(page?: number, limit?: number): Promise<{ leads: Lead[]; total: number }>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;

  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: number, admin: Partial<InsertAdmin>): Promise<Admin | undefined>;
  validateAdminPassword(username: string, password: string): Promise<Admin | null>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalProperties: number;
    totalLeads: number;
    activeListings: number;
    monthlyViews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getProperties(params: PropertySearchParams): Promise<{ properties: Property[]; total: number }> {
    const conditions = [];
    
    // Always show only active properties
    conditions.push(eq(properties.isActive, true));

    if (params.location) {
      conditions.push(
        or(
          ilike(properties.location, `%${params.location}%`),
          ilike(properties.city, `%${params.location}%`)
        )
      );
    }

    if (params.propertyType) {
      conditions.push(eq(properties.propertyType, params.propertyType));
    }

    if (params.bhkType) {
      conditions.push(eq(properties.bhkType, params.bhkType));
    }

    if (params.city) {
      conditions.push(ilike(properties.city, `%${params.city}%`));
    }

    if (params.possessionStatus) {
      conditions.push(eq(properties.possessionStatus, params.possessionStatus));
    }

    if (params.minPrice) {
      conditions.push(gte(properties.price, params.minPrice.toString()));
    }

    if (params.maxPrice) {
      conditions.push(lte(properties.price, params.maxPrice.toString()));
    }

    if (params.minArea) {
      conditions.push(gte(properties.area, params.minArea));
    }

    if (params.maxArea) {
      conditions.push(lte(properties.area, params.maxArea));
    }

    if (params.isFeatured) {
      conditions.push(eq(properties.isFeatured, true));
    }

    if (params.amenities && params.amenities.length > 0) {
      conditions.push(
        sql`${properties.amenities} @> ${JSON.stringify(params.amenities)}`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(properties)
      .where(whereClause);

    // Get properties with pagination
    const orderBy = params.sortOrder === "desc" ? desc : asc;
    const sortColumn = properties[params.sortBy as keyof typeof properties] || properties.createdAt;

    const results = await db
      .select()
      .from(properties)
      .where(whereClause)
      .orderBy(orderBy(sortColumn))
      .limit(params.limit)
      .offset((params.page - 1) * params.limit);

    return { properties: results, total };
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(and(eq(properties.id, id), eq(properties.isActive, true)));
    return property;
  }

  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(and(eq(properties.isFeatured, true), eq(properties.isActive, true)))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values({
        ...property,
        updatedAt: new Date(),
      })
      .returning();
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...property,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db
      .update(properties)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(properties.id, id));
    return result.rowCount > 0;
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await db
      .update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, id));
  }

  async getLeads(page = 1, limit = 20): Promise<{ leads: Lead[]; total: number }> {
    const [{ total }] = await db.select({ total: count() }).from(leads);

    const results = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return { leads: results, total };
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updatedLead] = await db
      .update(leads)
      .set({
        ...lead,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead;
  }

  async deleteLead(id: number): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return result.rowCount > 0;
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(and(eq(admins.id, id), eq(admins.isActive, true)));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(and(eq(admins.username, username), eq(admins.isActive, true)));
    return admin;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(and(eq(admins.email, email), eq(admins.isActive, true)));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const [newAdmin] = await db
      .insert(admins)
      .values({
        ...admin,
        password: hashedPassword,
      })
      .returning();
    return newAdmin;
  }

  async updateAdmin(id: number, admin: Partial<InsertAdmin>): Promise<Admin | undefined> {
    const updateData: any = { ...admin, updatedAt: new Date() };
    
    if (admin.password) {
      updateData.password = await bcrypt.hash(admin.password, 10);
    }

    const [updatedAdmin] = await db
      .update(admins)
      .set(updateData)
      .where(eq(admins.id, id))
      .returning();
    return updatedAdmin;
  }

  async validateAdminPassword(username: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return null;

    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }

  async getDashboardStats(): Promise<{
    totalProperties: number;
    totalLeads: number;
    activeListings: number;
    monthlyViews: number;
  }> {
    const [propertyStats] = await db
      .select({
        totalProperties: count(),
        activeListings: sql<number>`sum(case when ${properties.isActive} = true then 1 else 0 end)`,
        monthlyViews: sql<number>`sum(${properties.viewCount})`,
      })
      .from(properties);

    const [{ totalLeads }] = await db.select({ totalLeads: count() }).from(leads);

    return {
      totalProperties: propertyStats.totalProperties,
      totalLeads,
      activeListings: propertyStats.activeListings,
      monthlyViews: propertyStats.monthlyViews,
    };
  }
}

export const storage = new DatabaseStorage();
