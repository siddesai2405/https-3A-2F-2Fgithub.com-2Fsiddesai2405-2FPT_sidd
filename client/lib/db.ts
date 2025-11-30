import Dexie, { Table } from "dexie";

export interface User {
  id?: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  profile: {
    cycleLength: number;
    lutealLength: number;
    lastPeriodStart?: string;
  };
  createdAt: number;
}

export interface Event {
  id?: number;
  userId: number;
  date: string; // YYYY-MM-DD
  type: "period" | "symptom" | "note" | "pill" | "mood";
  mood?: "happy" | "neutral" | "sad" | "angry" | "tired" | "excited";
  moodIntensity?: number; // 1-5
  note?: string;
  intensity?: number; // 1-5 for symptoms
  symptoms?: string[]; // e.g., ['cramps', 'bloating', 'headache']
  createdAt: number;
  updatedAt: number;
}

export interface Gynecologist {
  id?: number;
  name: string;
  clinic: string;
  address: string;
  phone: string;
  lat?: number;
  lng?: number;
  notes?: string;
  specialization?: string;
  createdAt: number;
}

export interface Settings {
  id?: number;
  userId: number;
  cycleLength: number;
  lutealLength: number;
  periodLength: number;
  notificationsEnabled: boolean;
  theme: "light" | "dark" | "auto";
  language: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppSession {
  id?: number;
  currentUserId: number;
  loginTime: number;
}

export class PeriodTrackerDB extends Dexie {
  users!: Table<User>;
  events!: Table<Event>;
  gynecologists!: Table<Gynecologist>;
  settings!: Table<Settings>;
  session!: Table<AppSession>;

  constructor() {
    super("PeriodTrackerDB");
    this.version(1).stores({
      users: "++id, email",
      events: "++id, userId, date, [userId+date]",
      gynecologists: "++id",
      settings: "++id, userId",
      session: "++id",
    });
  }
}

export const db = new PeriodTrackerDB();

// Helper functions
export async function getCurrentUser(): Promise<User | undefined> {
  const session = await db.session.toCollection().first();
  if (session) {
    return db.users.get(session.currentUserId);
  }
  return undefined;
}

export async function setCurrentUser(userId: number): Promise<void> {
  await db.session.clear();
  await db.session.add({
    currentUserId: userId,
    loginTime: Date.now(),
  });
}

export async function clearSession(): Promise<void> {
  await db.session.clear();
}

export async function getUserEvents(
  userId: number,
  startDate?: string,
  endDate?: string,
): Promise<Event[]> {
  let query = db.events.where("userId").equals(userId);

  if (startDate && endDate) {
    query = query.filter((e) => e.date >= startDate && e.date <= endDate);
  }

  return query.toArray();
}

export async function addEvent(
  event: Omit<Event, "id" | "createdAt" | "updatedAt">,
): Promise<number> {
  return db.events.add({
    ...event,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateEvent(
  id: number,
  updates: Partial<Event>,
): Promise<number> {
  await db.events.update(id, {
    ...updates,
    updatedAt: Date.now(),
  });
  return id;
}

export async function deleteEvent(id: number): Promise<void> {
  await db.events.delete(id);
}

export async function getGynecologists(): Promise<Gynecologist[]> {
  return db.gynecologists.toArray();
}

export async function addGynecologist(
  gyn: Omit<Gynecologist, "id" | "createdAt">,
): Promise<number> {
  return db.gynecologists.add({
    ...gyn,
    createdAt: Date.now(),
  });
}

export async function bulkImportGynecologists(
  gynecologists: Omit<Gynecologist, "id" | "createdAt">[],
): Promise<void> {
  await db.gynecologists.clear();
  await db.gynecologists.bulkAdd(
    gynecologists.map((g) => ({
      ...g,
      createdAt: Date.now(),
    })),
  );
}

export async function getUserSettings(
  userId: number,
): Promise<Settings | undefined> {
  return db.settings.where("userId").equals(userId).first();
}

export async function updateUserSettings(
  userId: number,
  updates: Partial<Settings>,
): Promise<void> {
  const existing = await getUserSettings(userId);
  if (existing) {
    await db.settings.update(existing.id!, {
      ...updates,
      updatedAt: Date.now(),
    });
  } else {
    await db.settings.add({
      userId,
      cycleLength: 28,
      lutealLength: 14,
      periodLength: 5,
      notificationsEnabled: true,
      theme: "auto",
      language: "en",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...updates,
    });
  }
}
