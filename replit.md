# MyTools Admin - Application Mobile

## Overview
This is a mobile application built with Expo React Native, exclusively for administrators of MyTools partner garages. It enables comprehensive management of quotes, invoices, reservations, clients, and services through the MyTools Group back-office. The primary purpose is to provide a dedicated mobile interface for garage administrators to efficiently manage their operations.

## User Preferences
- Language: Français
- Interface entièrement en français
- Design professionnel automobile (thème sombre: noir #0A0A0A, rouge #DC2626, blanc)
- Font: Inter (Google Fonts)
- Logo: cropped-Logo-2-1-768x543 intégré dans l'app

## Social Authentication (Firebase)

Added social login with Google, Apple (iOS), Facebook, and Twitter/X. Uses Firebase Auth JS SDK on the frontend and validates Firebase ID tokens via Firebase REST API on the backend.

### New files
- `lib/firebase.ts` — Firebase app + auth initialization (inMemoryPersistence)
- `components/SocialLoginButtons.tsx` — Social login UI (expo-auth-session + expo-apple-authentication)
- `server/social-auth.ts` — Backend routes: `POST /api/auth/social`, `POST /api/auth/social/onboarding-complete`

### New DB table: `social_users`
Stores social auth users locally with onboarding status.

### Required environment variables
**Frontend (EXPO_PUBLIC_*):**
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_FACEBOOK_APP_ID`
- `EXPO_PUBLIC_TWITTER_CLIENT_ID`

**Backend:**
- `FIREBASE_SERVICE_ACCOUNT_JSON` (Firebase Admin SDK service account JSON)
- `SOCIAL_JWT_SECRET` (secret for signing social auth JWTs)

### Social auth email verification
Social login (Google/Apple) now checks if the user's email exists in the external API database before allowing access. Calls `GET https://saas3.mytoolsgroup.eu/api/users/check-email?email=xxx` — returns `{ exists: true/false }`. If the email is not found, login is rejected with a 403 error.

### Navigation after social login
- New user or onboarding not completed → `/onboarding`
- Returning user with onboarding done → `/(main)`
- Email not found in external DB → error alert on login screen

## System Architecture
The application is built using Expo React Native with file-based routing via Expo Router for the frontend. It consumes an external API hosted on `saas3.mytoolsgroup.eu`. Authentication is handled via a dual system: Bearer tokens for admin API calls and cookie sessions for client-side interactions. State management utilizes React Query for server data and React Context for authentication.

Key features include:
- Role-based routing, directing `admin`/`employe` users to the `(admin)` interface and `client` users to the `(main)` interface.
- Admin interface provides a dashboard with KPIs and CRUD operations for quotes, invoices, reservations, and clients.
- Admin authentication uses Bearer tokens stored in SecureStore.
- Client authentication uses cookie-based sessions stored in SecureStore.
- OCR scanning functionality for admin forms (invoice-create, quote-create) to extract information from documents using Gemini Vision.
- Auto-refresh polling for data: quotes every 30s, invoices/reservations every 60s.
- Robust API response handling with auto-unwrapping and extensive field name fallbacks for amounts and line items.
- Quote status flows from `pending` to `sent`, `approved`, and `accepted`, with appropriate UI actions.
- Invoice creation is integrated with quotes via a "Générer facture" button in quote detail, requiring photo upload for quotes.
- Numeric conversion and sanitization of items array for API payloads.
- PDF sharing via PWA URLs (saas3.mytoolsgroup.eu/quotes/view/{viewToken} or /invoices/view/{viewToken}).
- Client creation is disabled — only editing existing clients is allowed. "Nouveau client" buttons have been removed from the create modal, clients list, and all create forms (quote, invoice, reservation).

## Tab Navigation
The admin tab bar has the following tabs:
- **Accueil** — Dashboard with KPIs and charts
- **Devis** — Quotes management
- **Factures** — Invoices management
- **+ (Create)** — Center button opening creation modal
- **Plus** — Features menu (RDV, OCR Scanner, AI Analytics)
- **Clients** — Client management
- **Réglages** — Settings

The "Plus" tab replaced the previous "RDV" tab and provides access to:
- Rendez-vous (reservations) — always available
- OCR Scanner (quote/invoice) — always available
- AI Analytics (global, commercial, growth) — conditionally available based on garage plan (Pro+)

## Photo Upload
- Quotes: Two-step process — create quote shell, then upload media via POST to `/api/admin/quotes/{id}/media`
- Invoices: Same two-step process — create invoice, then upload media via POST to `/api/admin/invoices/{id}/media`
- Photos are displayed in both quote-detail and invoice-detail screens

## OCR
- Uses Gemini 2.0 Flash vision model via `/api/ocr/analyze` endpoint
- Supports both camera capture and gallery import
- Extracts structured data: client info, vehicle info (quotes), line items, payment method (invoices)
- 30-second timeout for AI analysis
- Fallback to empty template if extraction fails

## Garage Plan & AI Features
- `getGaragePlan()` in admin-api.ts fetches user info from `/api/auth/me`
- Detects garage plan (free, pro, premium, enterprise, etc.)
- AI analytics features gated behind Pro+ plans
- Custom features array also checked for granular feature enablement

## External Dependencies
- **Backend API**: `saas3.mytoolsgroup.eu` (configurable via `EXTERNAL_API_URL`)
- **Authentication**: Bearer tokens and cookie sessions managed by the external API.
- **Data Storage**: AsyncStorage for GDPR consent, SecureStore for authentication tokens and session cookies.
- **OCR**: Gemini Vision via `/api/ocr/analyze` endpoint for document scanning.
- **AI Analytics**: Via `/api/admin/advanced-analytics` endpoint.
- **Push Notifications**: Integrated for user notifications.
