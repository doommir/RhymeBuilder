import express from 'express';
import multer from 'multer';
import { verifyFirebaseToken } from '../services/firebase';
import { db } from '../db';
import { transcriptions } from '@shared/schema';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', verifyFirebaseToken, upload.single('audio'), async (req, res) => {
  const file = req.file;
  const uid = (req as any).uid;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const form = new FormData();
    form.append('file', new Blob([file.buffer]), file.originalname);
    form.append('model', 'whisper-1');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: form as any, // You might need to cast if using native FormData
    });

    const data = await whisperRes.json();
    if (!data.text) throw new Error('Transcription failed');

    await db.insert(transcriptions).values({
      uid,
      audioPath: '', // Optional: Upload to S3 or local path later
      text: data.text,
      createdAt: new Date(),
    });

    res.json({ transcription: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Audio transcription failed' });
  }
});

export default router;
