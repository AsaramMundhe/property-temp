import { apiRequest } from "./queryClient";
import type { Property, Lead, InsertLead, PropertySearchParams } from "@shared/schema";

export const api = {
  // Properties
  getProperties: async (params: PropertySearchParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const response = await apiRequest("GET", `/api/properties?${searchParams}`);
    return response.json();
  },

  getProperty: async (id: number): Promise<Property> => {
    const response = await apiRequest("GET", `/api/properties/${id}`);
    return response.json();
  },

  getFeaturedProperties: async (limit = 6): Promise<Property[]> => {
    const response = await apiRequest("GET", `/api/properties/featured?limit=${limit}`);
    return response.json();
  },

  // Search
  getSearchSuggestions: async (query: string): Promise<Array<{ value: string; label: string }>> => {
    const response = await apiRequest("GET", `/api/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Leads
  createLead: async (lead: InsertLead): Promise<Lead> => {
    const response = await apiRequest("POST", "/api/leads", lead);
    return response.json();
  },

  // Admin Authentication
  adminLogin: async (username: string, password: string) => {
    const response = await apiRequest("POST", "/api/admin/login", { username, password });
    return response.json();
  },

  verifyAdminToken: async () => {
    const response = await apiRequest("GET", "/api/admin/verify");
    return response.json();
  },

  // Admin Operations
  getDashboardStats: async () => {
    const response = await apiRequest("GET", "/api/admin/stats");
    return response.json();
  },

  getAdminProperties: async (params: PropertySearchParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const response = await apiRequest("GET", `/api/admin/properties?${searchParams}`);
    return response.json();
  },

  createProperty: async (property: any) => {
    const response = await apiRequest("POST", "/api/admin/properties", property);
    return response.json();
  },

  updateProperty: async (id: number, property: any) => {
    const response = await apiRequest("PUT", `/api/admin/properties/${id}`, property);
    return response.json();
  },

  deleteProperty: async (id: number) => {
    const response = await apiRequest("DELETE", `/api/admin/properties/${id}`);
    return response.json();
  },

  getAdminLeads: async (page = 1, limit = 20) => {
    const response = await apiRequest("GET", `/api/admin/leads?page=${page}&limit=${limit}`);
    return response.json();
  },

  updateLead: async (id: number, lead: any) => {
    const response = await apiRequest("PUT", `/api/admin/leads/${id}`, lead);
    return response.json();
  },

  deleteLead: async (id: number) => {
    const response = await apiRequest("DELETE", `/api/admin/leads/${id}`);
    return response.json();
  },
};
