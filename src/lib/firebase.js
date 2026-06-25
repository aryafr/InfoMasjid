import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project-id.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id"
};

// Check if we are running in local demo / mock mode
const isMockFirebase = firebaseConfig.projectId === "mock-project-id" || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Initialize Firebase for SSR compatibility
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

// Enable Offline Persistence (Offline-First) hanya di sisi Client (Browser)
if (typeof window !== 'undefined' && !isMockFirebase) {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firebase Persistence: Tab ganda terdeteksi. Offline mode hanya aktif di satu tab utama.');
      } else if (err.code === 'unimplemented') {
        console.warn('Firebase Persistence: Browser ini tidak mendukung mode offline.');
      }
    });
}

export { app, db, auth, isMockFirebase };
