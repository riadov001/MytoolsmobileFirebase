import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, inMemoryPersistence } from "firebase/auth";

let firebaseApp: any = null;
let firebaseAuth: any = null;
let initAttempted = false;

export function isFirebaseConfigured(): boolean {
  const hasRequired =
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

  if (!hasRequired) return false;

  // Additional validation: API key should not contain template strings
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
  if (apiKey.includes("${") || apiKey.includes("AIzaSy") === false) {
    return false;
  }

  return true;
}

export function getFirebaseAuth() {
  if (initAttempted) return firebaseAuth;

  initAttempted = true;

  if (!isFirebaseConfigured()) {
    console.log("[Firebase] Not configured, skipping initialization");
    return null;
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };

    firebaseApp =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    firebaseAuth = initializeAuth(firebaseApp, {
      persistence: inMemoryPersistence,
    });

    return firebaseAuth;
  } catch (err: any) {
    console.error("[Firebase] Init failed:", err?.message);
    firebaseApp = null;
    firebaseAuth = null;
    return null;
  }
}
