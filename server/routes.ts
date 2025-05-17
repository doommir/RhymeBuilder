import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const { username } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        const user = {
          id: existingUser.id,
          username: existingUser.username,
          xp: existingUser.xp || 0
        };
        return res.status(200).json(user);
      }
      
      // Create new user
      const newUser = await storage.createUser({
        username,
        password: "password" // Simple password for MVP
      });
      
      const user = {
        id: newUser.id,
        username: newUser.username,
        xp: newUser.xp || 0
      };
      
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Update user XP
  app.put('/api/users/:username/xp', async (req, res) => {
    try {
      const { username } = req.params;
      const { xp } = req.body;
      
      // For this MVP, we'll just return success
      // In a real app, we would update the user's XP in the database
      res.status(200).json({ 
        username,
        xp
      });
    } catch (error) {
      console.error('Error updating XP:', error);
      res.status(500).json({ message: 'Failed to update XP' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
