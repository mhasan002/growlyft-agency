import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const discoveryCallSubmissions = pgTable("discovery_call_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  businessName: text("business_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  countryCode: text("country_code").notNull().default("+1"),
  servicesInterested: text("services_interested").array().notNull(),
  budgetAllocated: text("budget_allocated").notNull(),
  minimumBudget: text("minimum_budget").notNull(),
  preferredDate: text("preferred_date").notNull(),
  timeZone: text("time_zone").notNull(),
  callPlatform: text("call_platform").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertDiscoveryCallSchema = createInsertSchema(discoveryCallSubmissions).pick({
  fullName: true,
  businessName: true,
  websiteUrl: true,
  email: true,
  phoneNumber: true,
  countryCode: true,
  servicesInterested: true,
  budgetAllocated: true,
  minimumBudget: true,
  preferredDate: true,
  timeZone: true,
  callPlatform: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  countryCode: z.string().min(2, "Please select a country code"),
  servicesInterested: z.array(z.string()).min(1, "Please select at least one service"),
  budgetAllocated: z.enum(["ready_now", "next_1_3_months", "exploring"], {
    required_error: "Please select your budget status",
  }),
  minimumBudget: z.enum(["under_300", "300_500", "500_1000", "1000_plus"], {
    required_error: "Please select your minimum budget",
  }),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  timeZone: z.string().min(1, "Please select your time zone"),
  callPlatform: z.enum(["zoom", "google_meet", "whatsapp"], {
    required_error: "Please select a call platform",
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertDiscoveryCall = z.infer<typeof insertDiscoveryCallSchema>;
export type DiscoveryCallSubmission = typeof discoveryCallSubmissions.$inferSelect;
