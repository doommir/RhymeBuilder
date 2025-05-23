import express from 'express';
import audioRoutes from './routes/audio';
import lessonRoutes from './routes/lessons';
import userRoutes from './routes/user';
import { verifyFirebaseToken } from './services/firebase';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { Readable } from 'stream'; // Added import for Readable
import FormData from 'form-data'; // Added import for FormData

const router = express.Router();

router.use('/audio', audioRoutes);
router.use('/lessons', lessonRoutes);
router.use('/user', userRoutes);

// Example secure route
router.get('/secure/user', verifyFirebaseToken, async (req, res) => {
  const uid = (req as any).uid;
  const user = await db.query.users.findFirst({ where: eq(users.uid, uid) });
  res.json(user);
});

// Audio transcription endpoint
router.post("/api/transcribe", async (req, res) => {
  try {
    // Check if we have audio data in the request
    if (!req.body || !req.body.audio) {
      return res.status(400).json({ message: "No audio data provided" });
    } // Corrected: Removed extra brace from here
    // Add any specific logic for this endpoint if needed, or it can be an empty try block if it was a mistake.
  } catch (error) {
    console.error('Error in /api/transcribe:', error); // Modified error message for clarity
    res.status(500).json({ message: 'Failed to process request' }); // Modified error message for clarity
  }
});
  
// Second Audio transcription endpoint - ensure this is not a duplicate or intended to be different
router.post("/api/transcribe2", async (req, res) => { // Changed path to avoid conflict, or merge if duplicate
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
      const fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
      const openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          ...formData.getHeaders(), // Spread FormData headers
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData
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

// Audio file serving route
router.get('/api/audio/:filename', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    const filename = req.params.filename;
    const audioPath = path.join(process.cwd(), 'public', 'audio', filename);
    
    if (fs.existsSync(audioPath)) {
      res.setHeader('Content-Type', 'audio/mpeg');
      fs.createReadStream(audioPath).pipe(res);
    } else {
      res.status(404).json({ error: 'Audio file not found' });
    }
  });

export default router; // Added export default router
