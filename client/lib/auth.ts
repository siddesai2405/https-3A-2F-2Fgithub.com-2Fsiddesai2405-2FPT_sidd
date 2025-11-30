import bcryptjs from 'bcryptjs';
import { db, User } from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
): Promise<User> {
  // Check if user already exists
  const existing = await db.users.where('email').equals(email).first();
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(password);
  
  const userId = await db.users.add({
    name,
    email,
    passwordHash,
    role,
    profile: {
      cycleLength: 28,
      lutealLength: 14,
    },
    createdAt: Date.now(),
  });

  return {
    id: userId,
    name,
    email,
    passwordHash,
    role,
    profile: {
      cycleLength: 28,
      lutealLength: 14,
    },
    createdAt: Date.now(),
  };
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await db.users.where('email').equals(email).first();
  
  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await verifyPassword(password, user.passwordHash);
  
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  return user;
}

export async function getAllUsers(): Promise<User[]> {
  return db.users.toArray();
}

export async function deleteUser(userId: number): Promise<void> {
  await db.users.delete(userId);
  // Also delete associated data
  const events = await db.events.where('userId').equals(userId).toArray();
  await Promise.all(events.map(e => db.events.delete(e.id!)));
  
  const settings = await db.settings.where('userId').equals(userId).toArray();
  await Promise.all(settings.map(s => db.settings.delete(s.id!)));
}
