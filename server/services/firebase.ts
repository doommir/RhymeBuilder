import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

const hasCredentials = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    !process.env.FIREBASE_PROJECT_ID?.includes('your-project') &&
    process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY?.includes('FAKE') &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    !process.env.FIREBASE_CLIENT_EMAIL?.includes('your-'),
);

if (hasCredentials && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} else if (!hasCredentials) {
  console.warn('Firebase credentials not found. Skipping initialization.');
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!hasCredentials) {
    // When credentials are missing, skip verification for easier local testing.
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).uid = decoded.uid;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
