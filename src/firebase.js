import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";

// Debug uchun
console.log("Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

const requiredEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
];
const missingEnv = requiredEnv.filter((key) => !import.meta.env[key]);
if (missingEnv.length) {
  console.error(`Missing Firebase env variables: ${missingEnv.join(", ")}`);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app = null;
if (missingEnv.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  console.error('Firebase not initialized due to missing env vars');
}

let auth = null;
if (app) {
  auth = getAuth(app);
} else {
  console.error('Auth not initialized because Firebase app is missing');
}

const db = app ? initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
}) : null;

let analytics = null;
if (app && typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
}

export {
  app,
  auth,
  db,
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
};