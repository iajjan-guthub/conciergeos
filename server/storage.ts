import {
  agencies, users, owners, properties, bookings, tasks, incidents, messages, invoices,
} from "@shared/schema";
import type {
  Agency, InsertAgency, User, InsertUser, Owner, InsertOwner,
  Property, InsertProperty, Booking, InsertBooking,
  Task, InsertTask, Incident, InsertIncident,
  Message, InsertMessage, Invoice, InsertInvoice,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

// Bootstrap schema (idempotent)
sqlite.exec(`
CREATE TABLE IF NOT EXISTS agencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'starter',
  trial_ends_at TEXT,
  email TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_id INTEGER NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'member',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT
);
CREATE TABLE IF NOT EXISTS owners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_id INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT
);
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  capacity INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'active',
  occupancy_rate REAL NOT NULL DEFAULT 0,
  monthly_revenue REAL NOT NULL DEFAULT 0,
  image_url TEXT
);
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price REAL NOT NULL,
  commission REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed',
  channel TEXT NOT NULL DEFAULT 'airbnb',
  access_code TEXT
);
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER,
  property_id INTEGER NOT NULL,
  assignee_id INTEGER,
  assignee_name TEXT,
  type TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT
);
CREATE TABLE IF NOT EXISTS incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER,
  property_id INTEGER NOT NULL,
  reported_by TEXT,
  severity TEXT NOT NULL DEFAULT 'normal',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  cost REAL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  channel TEXT NOT NULL DEFAULT 'airbnb',
  direction TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TEXT NOT NULL,
  is_automated INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
  owner_name TEXT NOT NULL,
  period TEXT NOT NULL,
  gross_revenue REAL NOT NULL,
  commission REAL NOT NULL,
  net_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);
`);

export interface IStorage {
  getProperties(): Property[];
  getProperty(id: number): Property | undefined;
  createProperty(p: InsertProperty): Property;
  getBookings(): Booking[];
  getBooking(id: number): Booking | undefined;
  createBooking(b: InsertBooking): Booking;
  getTasks(): Task[];
  createTask(t: InsertTask): Task;
  updateTaskStatus(id: number, status: string): Task | undefined;
  getIncidents(): Incident[];
  createIncident(i: InsertIncident): Incident;
  getMessages(bookingId?: number): Message[];
  createMessage(m: InsertMessage): Message;
  getInvoices(): Invoice[];
  getOwners(): Owner[];
  getUsers(): User[];
  getAgency(): Agency | undefined;
}

class DatabaseStorage implements IStorage {
  getProperties() { return db.select().from(properties).all(); }
  getProperty(id: number) { return db.select().from(properties).where(eq(properties.id, id)).get(); }
  createProperty(p: InsertProperty) { return db.insert(properties).values(p).returning().get(); }

  getBookings() { return db.select().from(bookings).all(); }
  getBooking(id: number) { return db.select().from(bookings).where(eq(bookings.id, id)).get(); }
  createBooking(b: InsertBooking) { return db.insert(bookings).values(b).returning().get(); }

  getTasks() { return db.select().from(tasks).all(); }
  createTask(t: InsertTask) { return db.insert(tasks).values(t).returning().get(); }
  updateTaskStatus(id: number, status: string) {
    return db.update(tasks).set({ status }).where(eq(tasks.id, id)).returning().get();
  }

  getIncidents() { return db.select().from(incidents).all(); }
  createIncident(i: InsertIncident) { return db.insert(incidents).values(i).returning().get(); }

  getMessages(bookingId?: number) {
    if (bookingId !== undefined) {
      return db.select().from(messages).where(eq(messages.bookingId, bookingId)).all();
    }
    return db.select().from(messages).all();
  }
  createMessage(m: InsertMessage) { return db.insert(messages).values(m).returning().get(); }

  getInvoices() { return db.select().from(invoices).all(); }
  getOwners() { return db.select().from(owners).all(); }
  getUsers() { return db.select().from(users).all(); }
  getAgency() { return db.select().from(agencies).get(); }
}

export const storage = new DatabaseStorage();

// Seed data — only seed once
function seed() {
  const existing = db.select().from(agencies).get();
  if (existing) return;

  const agency = db.insert(agencies).values({
    name: "Conciergerie Paris Elite",
    slug: "paris-elite",
    plan: "pro",
    trialEndsAt: "2026-06-15",
    email: "contact@parisselite.fr",
  }).returning().get();

  db.insert(users).values([
    { agencyId: agency.id, email: "marie@parisselite.fr", role: "admin", fullName: "Marie Laurent", phone: "+33 6 12 34 56 78" },
    { agencyId: agency.id, email: "thomas@parisselite.fr", role: "member", fullName: "Thomas Bernard", phone: "+33 6 23 45 67 89" },
    { agencyId: agency.id, email: "sophie@parisselite.fr", role: "member", fullName: "Sophie Moreau", phone: "+33 6 34 56 78 90" },
  ]).run();

  const owner1 = db.insert(owners).values({ agencyId: agency.id, fullName: "Jean Dupont", email: "jdupont@example.com", phone: "+33 6 11 22 33 44" }).returning().get();
  const owner2 = db.insert(owners).values({ agencyId: agency.id, fullName: "Catherine Rousseau", email: "crousseau@example.com", phone: "+33 6 22 33 44 55" }).returning().get();
  const owner3 = db.insert(owners).values({ agencyId: agency.id, fullName: "Pierre Lefèvre", email: "plefevre@example.com", phone: "+33 6 33 44 55 66" }).returning().get();

  const p1 = db.insert(properties).values({
    agencyId: agency.id, ownerId: owner1.id, name: "Villa Les Pins",
    address: "12 Avenue des Pins", city: "Cannes", type: "Villa",
    bedrooms: 4, capacity: 8, status: "active", occupancyRate: 0.78, monthlyRevenue: 12450,
  }).returning().get();
  const p2 = db.insert(properties).values({
    agencyId: agency.id, ownerId: owner2.id, name: "Appartement Montmartre",
    address: "8 rue des Abbesses", city: "Paris 18e", type: "Appartement",
    bedrooms: 2, capacity: 4, status: "active", occupancyRate: 0.85, monthlyRevenue: 4280,
  }).returning().get();
  const p3 = db.insert(properties).values({
    agencyId: agency.id, ownerId: owner3.id, name: "Studio Canal",
    address: "24 quai de Jemmapes", city: "Paris 10e", type: "Studio",
    bedrooms: 1, capacity: 2, status: "active", occupancyRate: 0.92, monthlyRevenue: 2890,
  }).returning().get();

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  const b1 = db.insert(bookings).values({
    propertyId: p1.id, guestName: "Olivia Martin", guestEmail: "omartin@example.com", guestPhone: "+33 6 88 77 66 55",
    checkIn: fmt(today), checkOut: fmt(addDays(today, 5)), guests: 6,
    totalPrice: 2450, commission: 367, status: "active", channel: "airbnb", accessCode: "4827",
  }).returning().get();
  const b2 = db.insert(bookings).values({
    propertyId: p2.id, guestName: "Lucas Schmidt", guestEmail: "lschmidt@example.com",
    checkIn: fmt(today), checkOut: fmt(addDays(today, 3)), guests: 2,
    totalPrice: 480, commission: 72, status: "active", channel: "booking", accessCode: "1956",
  }).returning().get();
  const b3 = db.insert(bookings).values({
    propertyId: p3.id, guestName: "Emma García", guestEmail: "egarcia@example.com",
    checkIn: fmt(addDays(today, 2)), checkOut: fmt(addDays(today, 7)), guests: 2,
    totalPrice: 720, commission: 108, status: "confirmed", channel: "airbnb", accessCode: "7314",
  }).returning().get();
  const b4 = db.insert(bookings).values({
    propertyId: p1.id, guestName: "Hiroshi Tanaka", guestEmail: "htanaka@example.com",
    checkIn: fmt(addDays(today, 10)), checkOut: fmt(addDays(today, 15)), guests: 4,
    totalPrice: 2200, commission: 330, status: "confirmed", channel: "direct",
  }).returning().get();
  const b5 = db.insert(bookings).values({
    propertyId: p2.id, guestName: "Marco Rossi", guestEmail: "mrossi@example.com",
    checkIn: fmt(addDays(today, -7)), checkOut: fmt(addDays(today, -2)), guests: 2,
    totalPrice: 620, commission: 93, status: "completed", channel: "booking",
  }).returning().get();

  db.insert(tasks).values([
    { bookingId: b1.id, propertyId: p1.id, assigneeName: "Carmen Lopez", type: "menage", scheduledAt: fmt(today) + " 10:00", status: "completed", notes: "Ménage avant arrivée Olivia Martin" },
    { bookingId: b2.id, propertyId: p2.id, assigneeName: "Yacine Benali", type: "check-in", scheduledAt: fmt(today) + " 15:00", status: "in_progress", notes: "Remise des clés Lucas Schmidt" },
    { bookingId: null, propertyId: p3.id, assigneeName: "Carmen Lopez", type: "maintenance", scheduledAt: fmt(addDays(today, 1)) + " 09:00", status: "pending", notes: "Vérification chauffe-eau" },
    { bookingId: b5.id, propertyId: p2.id, assigneeName: "Yacine Benali", type: "depart", scheduledAt: fmt(addDays(today, -2)) + " 11:00", status: "completed", notes: "Vérification départ Marco Rossi" },
    { bookingId: b3.id, propertyId: p3.id, assigneeName: "Carmen Lopez", type: "menage", scheduledAt: fmt(addDays(today, 2)) + " 12:00", status: "pending", notes: "Préparation avant Emma García" },
  ]).run();

  db.insert(incidents).values([
    { bookingId: b1.id, propertyId: p1.id, reportedBy: "Olivia Martin", severity: "urgent", title: "Fuite d'eau salle de bain", description: "Robinet qui goutte abondamment, eau au sol", status: "open", cost: 0, createdAt: fmt(today) + " 14:23" },
    { bookingId: null, propertyId: p3.id, reportedBy: "Carmen Lopez", severity: "important", title: "Lave-vaisselle en panne", description: "Le lave-vaisselle ne démarre plus depuis hier", status: "in_progress", cost: 180, createdAt: fmt(addDays(today, -1)) + " 09:15" },
    { bookingId: b5.id, propertyId: p2.id, reportedBy: "Marco Rossi", severity: "normal", title: "Ampoule grillée salon", description: "À remplacer", status: "resolved", cost: 8, createdAt: fmt(addDays(today, -5)) + " 18:00" },
  ]).run();

  db.insert(messages).values([
    { bookingId: b1.id, channel: "airbnb", direction: "in", body: "Bonjour, à quelle heure pouvons-nous arriver ? Notre vol atterrit à 14h.", sentAt: fmt(addDays(today, -1)) + " 09:12", isAutomated: false },
    { bookingId: b1.id, channel: "airbnb", direction: "out", body: "Bonjour Olivia ! Bienvenue à Cannes 🌴 Vous pouvez accéder au logement dès 15h. Le code d'accès est 4827. Bon voyage !", sentAt: fmt(addDays(today, -1)) + " 09:34", isAutomated: false },
    { bookingId: b1.id, channel: "airbnb", direction: "in", body: "Parfait, merci beaucoup ! Y a-t-il un parking sur place ?", sentAt: fmt(addDays(today, -1)) + " 10:02", isAutomated: false },
    { bookingId: b1.id, channel: "airbnb", direction: "out", body: "Oui, le parking est inclus dans la cour. La place n°3 vous est réservée.", sentAt: fmt(addDays(today, -1)) + " 10:08", isAutomated: false },
    { bookingId: b1.id, channel: "airbnb", direction: "in", body: "Nous sommes bien arrivés. Petit souci : le robinet de la salle de bain fuit beaucoup.", sentAt: fmt(today) + " 14:23", isAutomated: false },
    { bookingId: b1.id, channel: "airbnb", direction: "out", body: "Oh non, désolés pour ce désagrément ! Un plombier sera chez vous dans l'heure. Nous vous tenons informée.", sentAt: fmt(today) + " 14:31", isAutomated: false },
  ]).run();

  db.insert(invoices).values([
    { agencyId: agency.id, ownerId: owner1.id, ownerName: "Jean Dupont", period: "Mai 2026", grossRevenue: 12450, commission: 1867, netAmount: 10583, status: "paid" },
    { agencyId: agency.id, ownerId: owner2.id, ownerName: "Catherine Rousseau", period: "Mai 2026", grossRevenue: 4280, commission: 642, netAmount: 3638, status: "pending" },
    { agencyId: agency.id, ownerId: owner3.id, ownerName: "Pierre Lefèvre", period: "Mai 2026", grossRevenue: 2890, commission: 433, netAmount: 2457, status: "pending" },
    { agencyId: agency.id, ownerId: owner1.id, ownerName: "Jean Dupont", period: "Avril 2026", grossRevenue: 11200, commission: 1680, netAmount: 9520, status: "paid" },
  ]).run();
}

seed();
