// Parse DEV_SECRETS_KEYS JSON and export Firebase public keys
const secretsJson = process.env.DEV_SECRETS_KEYS || "{}";

try {
  // Try to parse the JSON with better error reporting
  const secrets = JSON.parse(secretsJson);
  
  // Export public Firebase keys for frontend
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY = secrets.EXPO_PUBLIC_FIREBASE_API_KEY || secrets.GOOGLE_API_KEY_2 || "";
  process.env.EXPO_PUBLIC_FIREBASE_APP_ID = secrets.EXPO_PUBLIC_FIREBASE_APP_ID || "";
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = secrets.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = secrets.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = secrets.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "";
  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = secrets.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
  
  // Backend secrets
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON = secrets.FIREBASE_SERVICE_ACCOUNT_JSON || "";
  process.env.SOCIAL_JWT_SECRET = secrets.SOCIAL_JWT_SECRET || "";
  
  console.log("[DEV-SECRETS] Successfully loaded from DEV_SECRETS_KEYS");
} catch (err) {
  console.warn("[DEV-SECRETS] Could not parse DEV_SECRETS_KEYS JSON:", err.message);
  console.log("[DEV-SECRETS] Falling back to individual Replit secrets");
}
