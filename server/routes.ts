import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import FormData from "form-data";
import { Readable } from "stream";

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
  
  // Audio transcription endpoint
  app.post("/api/transcribe", async (req, res) => {
    try {
      // Check if we have audio data in the request
      if (!req.body || !req.body.audio) {
        return res.status(400).json({ message: "No audio data provided" });
      }
      
      const base64Audio = req.body.audio;
      
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(base64Audio, 'base64');
      
      // Create a form data object for the OpenAI API
      const formData = new FormData();
      
      // Add the audio file to the form data
      const audioStream = new Readable();
      audioStream.push(audioBuffer);
      audioStream.push(null);
      formData.append('file', audioStream, { 
        filename: 'audio.webm',
        contentType: 'audio/webm',
      });
      
      // Add the model parameter
      formData.append('model', 'whisper-1');
      
      // Call the OpenAI API
      const openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData as any
      });
      
      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.text();
        console.error('OpenAI API Error:', errorData);
        return res.status(500).json({ 
          message: "Transcription failed", 
          error: errorData 
        });
      }
      
      const transcriptionResult = await openAIResponse.json() as { text: string };
      
      // Process and split the transcription into lines
      const fullText = transcriptionResult.text || '';
      const lines = fullText
        .split(/(?<=[.!?])\s+/g)
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.trim());
      
      res.json({ 
        success: true,
        transcription: fullText,
        lines: lines
      });
    } catch (error: any) {
      console.error('Transcription error:', error);
      res.status(500).json({ 
        message: "Failed to process audio transcription",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
