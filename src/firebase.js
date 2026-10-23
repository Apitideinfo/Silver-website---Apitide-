import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Web App Configuration for 'jewellery---website'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAFIfud2F6ti2pOozdpY7FizUuWDFSo1ik",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jewellery---website.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jewellery---website",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jewellery---website.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "168135603206",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:168135603206:web:ab73600bb42c7722a13f87",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let messaging = null;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
}).catch((err) => {
  console.error("Firebase Messaging is not supported on this browser:", err);
});

export { db, auth, storage, messaging };
