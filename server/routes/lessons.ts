import express from 'express';
import { verifyFirebaseToken } from '../services/firebase';
import { db } from '../db';
import { lessons } from '@shared/schema';
import { awardXPAndUpdateStreak } from '../services/xp';

const router = express.Router();

router.get('/:id', verifyFirebaseToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const lesson = await db.select().from(lessons).where(eq(lessons.id, id));
  if (!lesson.length) return res.status(404).json({ error: "Lesson not found" });
  res.json(lesson[0]);
});

router.post('/complete', verifyFirebaseToken, async (req, res) => {
  const uid = (req as any).uid;
  const { lessonId } = req.body;

  const lesson = await db.select().from(lessons).where(eq(lessons.id, lessonId));
  if (!lesson.length) return res.status(404).json({ error: "Lesson not found" });

  const result = await awardXPAndUpdateStreak(uid, lessonId, lesson[0].xpValue ?? 10);
  res.json({ message: "Lesson completed", ...result });
});

export default router;
