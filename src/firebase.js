// src/firebase.js
// 1) Replace the firebaseConfig object with your project's config from the Firebase console.
// 2) Firestore stores all data; we enable offline persistence so entries sync if the iPad goes offline.

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableIndexedDbPersistence,
  serverTimestamp,
} from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const now = () => serverTimestamp();

// Enable offline persistence for resilience (syncs when back online).
enableIndexedDbPersistence(db).catch((err) => {
  // eslint-disable-next-line no-console
  console.warn(
    "IndexedDB persistence unavailable (private mode / multiple tabs):",
    err?.code || err
  );
});
