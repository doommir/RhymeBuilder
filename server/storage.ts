import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUserById(id: number): Promise<User | null>; // Renamed and changed return type
  getUserByUsername(username: string): Promise<User | null>; // Changed return type
  createUser(user: InsertUser): Promise<User>;
  updateUserXP(username: string, xp: number): Promise<User | null>; // Added new method
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUserById(id: number): Promise<User | null> { // Renamed and changed return type
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> { // Changed return type
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    ) || null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password, // Ensure password from InsertUser is used
      xp: 0, // Default value from schema
      streak: 1, // Default value from schema
      lastActive: new Date().toISOString(), // Default value from schema
      completedLessons: [], // Default value from schema
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserXP(username: string, newXp: number): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      (u) => u.username === username,
    );
    if (user) {
      user.xp = newXp;
      this.users.set(user.id, user);
      return user;
    }
    return null;
  }
}

// export const storage = new MemStorage(); // Keep for potential reference
import { DrizzleStorage } from './drizzle_storage';
export const storage = new DrizzleStorage();
