import type { Express } from "express";
import type { Server } from "node:http";
import { storage } from "./storage";
import {
  insertPropertySchema, insertBookingSchema, insertTaskSchema,
  insertIncidentSchema, insertMessageSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/properties", (_req, res) => {
    res.json(storage.getProperties());
  });
  app.get("/api/properties/:id", (req, res) => {
    const p = storage.getProperty(Number(req.params.id));
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  });
  app.post("/api/properties", (req, res) => {
    const parse = insertPropertySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    res.json(storage.createProperty(parse.data));
  });

  app.get("/api/bookings", (_req, res) => {
    res.json(storage.getBookings());
  });
  app.get("/api/bookings/:id", (req, res) => {
    const b = storage.getBooking(Number(req.params.id));
    if (!b) return res.status(404).json({ message: "Not found" });
    res.json(b);
  });
  app.post("/api/bookings", (req, res) => {
    const parse = insertBookingSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    res.json(storage.createBooking(parse.data));
  });

  app.get("/api/tasks", (_req, res) => {
    res.json(storage.getTasks());
  });
  app.post("/api/tasks", (req, res) => {
    const parse = insertTaskSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    res.json(storage.createTask(parse.data));
  });
  app.patch("/api/tasks/:id", (req, res) => {
    const status = String(req.body?.status || "");
    const updated = storage.updateTaskStatus(Number(req.params.id), status);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  });

  app.get("/api/incidents", (_req, res) => {
    res.json(storage.getIncidents());
  });
  app.post("/api/incidents", (req, res) => {
    const body = { ...req.body, createdAt: req.body?.createdAt ?? new Date().toISOString() };
    const parse = insertIncidentSchema.safeParse(body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    res.json(storage.createIncident(parse.data));
  });

  app.get("/api/messages", (req, res) => {
    const bookingId = req.query.bookingId ? Number(req.query.bookingId) : undefined;
    res.json(storage.getMessages(bookingId));
  });
  app.post("/api/messages", (req, res) => {
    const body = { ...req.body, sentAt: req.body?.sentAt ?? new Date().toISOString() };
    const parse = insertMessageSchema.safeParse(body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    res.json(storage.createMessage(parse.data));
  });

  app.get("/api/invoices", (_req, res) => {
    res.json(storage.getInvoices());
  });

  app.get("/api/owners", (_req, res) => {
    res.json(storage.getOwners());
  });

  app.get("/api/users", (_req, res) => {
    res.json(storage.getUsers());
  });

  app.get("/api/agency", (_req, res) => {
    res.json(storage.getAgency());
  });

  app.get("/api/dashboard/stats", (_req, res) => {
    const properties = storage.getProperties();
    const bookings = storage.getBookings();
    const incidents = storage.getIncidents();
    const tasks = storage.getTasks();
    const today = new Date().toISOString().slice(0, 10);

    const occupancyRate = properties.length
      ? properties.reduce((s, p) => s + p.occupancyRate, 0) / properties.length
      : 0;
    const totalRevenue = properties.reduce((s, p) => s + p.monthlyRevenue, 0);
    const revPAR = properties.length ? totalRevenue / properties.length / 30 : 0;
    const activeIncidents = incidents.filter(i => i.status !== "resolved").length;
    const todayArrivals = bookings.filter(b => b.checkIn === today);
    const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress");

    res.json({
      occupancyRate: Math.round(occupancyRate * 100),
      revPAR: Math.round(revPAR),
      avgRating: 4.8,
      activeIncidents,
      todayArrivals,
      pendingTasks,
      totalRevenue,
    });
  });

  app.get("/api/analytics", (_req, res) => {
    // Synthetic monthly data
    const months = ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai"];
    const baseRevenue = [14200, 15800, 12400, 11900, 16800, 18600, 19620];
    const occupancy = [62, 71, 58, 55, 74, 82, 85];
    const monthly = months.map((m, i) => ({
      month: m,
      revenue: baseRevenue[i],
      occupancy: occupancy[i],
      bookings: Math.round(baseRevenue[i] / 280),
    }));
    const properties = storage.getProperties();
    res.json({
      monthly,
      kpis: {
        totalRevenue: monthly.reduce((s, m) => s + m.revenue, 0),
        avgOccupancy: Math.round(monthly.reduce((s, m) => s + m.occupancy, 0) / monthly.length),
        revPAR: 218,
        adr: 287,
      },
      propertyPerformance: properties.map(p => ({
        id: p.id, name: p.name, city: p.city,
        revenue: p.monthlyRevenue, occupancy: Math.round(p.occupancyRate * 100),
      })),
    });
  });

  return httpServer;
}
