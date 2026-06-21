import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      // Attempt to initialize using environment variables
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace literal \n with actual newline characters
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = getApps().length > 0 ? getFirestore() : null;
export const adminAuth = getApps().length > 0 ? getAuth() : null;
export const adminFieldValue = FieldValue;

