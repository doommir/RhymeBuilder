import { db } from '../db';
import { users, lessonAttempts } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

export async function awardXPAndUpdateStreak(uid: string, lessonId: number, xpAmount: number) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const userRes = await db.select().from(users).where(eq(users.uid, uid));
  if (!userRes.length) throw new Error("User not found");

  const user = userRes[0];

  const lastAttemptArr = await db.select().from(lessonAttempts)
    .where(eq(lessonAttempts.uid, uid))
    .orderBy(desc(lessonAttempts.completedAt))
    .limit(1);
  const lastAttempt = lastAttemptArr[0];

  let newStreak = 1;
  if (lastAttempt && lastAttempt.completedAt) {
    const lastDate = new Date(lastAttempt.completedAt);
    const isYesterday = lastDate.toDateString() === yesterday.toDateString();
    newStreak = isYesterday ? user.streak + 1 : 1;
  }

  await db.insert(lessonAttempts).values({
    uid,
    lessonId,
    xpAwarded: xpAmount,
    isCompleted: true
  });

  await db.update(users).set({
    xp: user.xp + xpAmount,
    streak: newStreak,
    lastActive: today
  }).where(eq(users.uid, uid));

  return { xp: user.xp + xpAmount, streak: newStreak };
}
