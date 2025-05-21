import express from 'express';
import { verifyFirebaseToken } from '../services/firebase';
import { db } from '../db';
import { users, lessonAttempts } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

router.get('/progress', verifyFirebaseToken, async (req, res) => {
  const uid = (req as any).uid;

  const userRes = await db.select().from(users).where(eq(users.uid, uid));
  const progressRes = await db.select().from(lessonAttempts)
    .where(eq(lessonAttempts.uid, uid))
    .orderBy(desc(lessonAttempts.completedAt))
    .limit(10);

  if (!userRes.length) return res.status(404).json({ error: "User not found" });

  res.json({
    xp: userRes[0].xp,
    streak: userRes[0].streak,
    recentLessons: progressRes
  });
});

export default router;
