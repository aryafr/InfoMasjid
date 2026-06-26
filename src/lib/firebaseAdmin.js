import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      // 1. Remove wrapping quotes if they exist
      privateKey = privateKey.replace(/^["']+|["']+$/g, '');
      
      // 2. If the private key doesn't have the standard header, assume it's base64 encoded
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
         try {
             privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
             // Remove quotes again in case the encoded string had them
             privateKey = privateKey.replace(/^["']+|["']+$/g, '');
         } catch (e) {
             console.warn("Attempted to parse FIREBASE_PRIVATE_KEY as base64 but failed.");
         }
      }

      // 3. Replace literal \n with actual newline characters
      privateKey = privateKey.replace(/\\n/g, '\n');

      // 4. Fix mangled keys without newlines (sometimes platforms replace \n with spaces)
      if (!privateKey.includes('\n')) {
          privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/g, '-----BEGIN PRIVATE KEY-----\n');
          privateKey = privateKey.replace(/-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----\n');
      }

      privateKey = privateKey.trim();

      // Attempt to initialize using environment variables
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
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

