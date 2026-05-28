import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agencies = sqliteTable("agencies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").notNull().default("starter"),
  trialEndsAt: text("trial_ends_at"),
  email: text("email").notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agencyId: integer("agency_id").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("member"),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
});

export const owners = sqliteTable("owners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agencyId: integer("agency_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
});

export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agencyId: integer("agency_id").notNull(),
  ownerId: integer("owner_id").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  type: text("type").notNull(),
  bedrooms: integer("bedrooms").notNull().default(1),
  capacity: integer("capacity").notNull().default(2),
  status: text("status").notNull().default("active"),
  occupancyRate: real("occupancy_rate").notNull().default(0),
  monthlyRevenue: real("monthly_revenue").notNull().default(0),
  imageUrl: text("image_url"),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull().default(1),
  totalPrice: real("total_price").notNull(),
  commission: real("commission").notNull().default(0),
  status: text("status").notNull().default("confirmed"),
  channel: text("channel").notNull().default("airbnb"),
  accessCode: text("access_code"),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id"),
  propertyId: integer("property_id").notNull(),
  assigneeId: integer("assignee_id"),
  assigneeName: text("assignee_name"),
  type: text("type").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  completedAt: text("completed_at"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
});

export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id"),
  propertyId: integer("property_id").notNull(),
  reportedBy: text("reported_by"),
  severity: text("severity").notNull().default("normal"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"),
  cost: real("cost").default(0),
  createdAt: text("created_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull(),
  channel: text("channel").notNull().default("airbnb"),
  direction: text("direction").notNull(),
  body: text("body").notNull(),
  sentAt: text("sent_at").notNull(),
  isAutomated: integer("is_automated", { mode: "boolean" }).notNull().default(false),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agencyId: integer("agency_id").notNull(),
  ownerId: integer("owner_id").notNull(),
  ownerName: text("owner_name").notNull(),
  period: text("period").notNull(),
  grossRevenue: real("gross_revenue").notNull(),
  commission: real("commission").notNull(),
  netAmount: real("net_amount").notNull(),
  status: text("status").notNull().default("pending"),
});

// Insert schemas
export const insertAgencySchema = createInsertSchema(agencies).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertOwnerSchema = createInsertSchema(owners).omit({ id: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertIncidentSchema = createInsertSchema(incidents).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true });

export type Agency = typeof agencies.$inferSelect;
export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Owner = typeof owners.$inferSelect;
export type InsertOwner = z.infer<typeof insertOwnerSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
