import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  propertyType: varchar("property_type", { length: 50 }).notNull(), // apartment, villa, plot, commercial
  bhkType: varchar("bhk_type", { length: 20 }), // 1BHK, 2BHK, 3BHK, 4+BHK
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  pricePerSqft: decimal("price_per_sqft", { precision: 8, scale: 2 }),
  area: integer("area").notNull(), // in sq ft
  location: varchar("location", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }),
  address: text("address"),
  builderName: varchar("builder_name", { length: 255 }),
  projectStatus: varchar("project_status", { length: 50 }), // ongoing, completed, ready
  possessionStatus: varchar("possession_status", { length: 50 }), // ready, under-construction
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  facing: varchar("facing", { length: 50 }), // north, south, east, west
  furnishing: varchar("furnishing", { length: 50 }), // furnished, semi-furnished, unfurnished
  parkingSpaces: integer("parking_spaces").default(0),
  balconies: integer("balconies").default(0),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  virtualTourUrl: text("virtual_tour_url"),
  featuredImageUrl: text("featured_image_url"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message"),
  propertyId: integer("property_id").references(() => properties.id),
  source: varchar("source", { length: 50 }).default("website"), // website, phone, whatsapp
  status: varchar("status", { length: 50 }).default("new"), // new, contacted, qualified, closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin"), // admin, super-admin
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const propertiesRelations = relations(properties, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
}));

// Insert schemas
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

// Search and filter schemas
export const propertySearchSchema = z.object({
  location: z.string().optional(),
  propertyType: z.string().optional(),
  bhkType: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  city: z.string().optional(),
  possessionStatus: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
  sortBy: z.enum(["price", "area", "createdAt", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PropertySearchParams = z.infer<typeof propertySearchSchema>;
