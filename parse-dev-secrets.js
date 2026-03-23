// Parse DEV_SECRETS_KEYS JSON and export Firebase public keys
// Only override env vars if the value from DEV_SECRETS_KEYS is non-empty,
// so that individually-set Replit secrets are preserved.
const secretsJson = process.env.DEV_SECRETS_KEYS || "{}";

function setIfPresent(key, value) {
  if (value) process.env[key] = value;
}

try {
  const secrets = JSON.parse(secretsJson);
  
  setIfPresent("EXPO_PUBLIC_FIREBASE_API_KEY", secrets.EXPO_PUBLIC_FIREBASE_API_KEY || secrets.GOOGLE_API_KEY_2);
  setIfPresent("EXPO_PUBLIC_FIREBASE_APP_ID", secrets.EXPO_PUBLIC_FIREBASE_APP_ID);
  setIfPresent("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID", secrets.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
  setIfPresent("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", secrets.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN);
  setIfPresent("EXPO_PUBLIC_FIREBASE_PROJECT_ID", secrets.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
  setIfPresent("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET", secrets.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET);
  
  setIfPresent("FIREBASE_SERVICE_ACCOUNT_JSON", secrets.FIREBASE_SERVICE_ACCOUNT_JSON);
  setIfPresent("SOCIAL_JWT_SECRET", secrets.SOCIAL_JWT_SECRET);
  
  console.log("[DEV-SECRETS] Successfully loaded from DEV_SECRETS_KEYS");
} catch (err) {
  console.warn("[DEV-SECRETS] Could not parse DEV_SECRETS_KEYS JSON:", err.message);
  console.log("[DEV-SECRETS] Falling back to individual Replit secrets");
}
