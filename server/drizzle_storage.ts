import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { users, User, InsertUser } from '@shared/schema';
import * as schema from '@shared/schema'; // Import all exports from schema
import type { IStorage } from './storage'; // Adjusted path

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL settings can be more nuanced depending on the environment (local dev vs. production)
  // For local development, you might not need SSL or might need to set rejectUnauthorized to false
  // For production (e.g., Neon, Aiven, AWS RDS), SSL is typically required.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Pass the schema to Drizzle
const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

export class DrizzleStorage implements IStorage {
  async getUserById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async createUser(data: InsertUser): Promise<User> {
    // When inserting, Drizzle ORM relies on the database to apply default values
    // for columns not explicitly provided in 'data'. The 'users' schema has defaults.
    const result = await db.insert(users).values(data).returning();
    if (result.length === 0) {
      throw new Error('Failed to create user, no rows returned.');
    }
    return result[0];
  }

  async updateUserXP(username: string, newXp: number): Promise<User | null> {
    const result = await db.update(users)
      .set({ xp: newXp, lastActive: new Date().toISOString() }) // Also update lastActive on XP change
      .where(eq(users.username, username))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }
}
