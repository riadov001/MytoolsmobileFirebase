# Changes Since Last Successful Publish

**Last publish commit:** `e343996` — "Published your App"
**Current HEAD:** `139aa95` — "Improve Metro bundler startup and health checks for stability"
**Total commits since publish:** 6

---

## Summary of All Changes

### 1. Production Port Fix (Critical)

**File:** `.replit`

The production `PORT` was incorrectly set to `8081` (Expo dev port). Changed to `5000` so the Express server listens on the correct port in production.

```diff
[userenv.production]
-PORT = "8081"
+PORT = "5000"
```

### 2. System Dependency Added

**File:** `.replit`

Added `glib` to nix packages — required by the React Native DevTools binary to prevent build failures.

```diff
-packages = ["zip"]
+packages = ["zip", "glib"]
```

### 3. Additional Port Mappings

**File:** `.replit`

Added port mappings for the build process (Metro runs on a separate port during deployment builds):

```
[[ports]]
localPort = 8082
externalPort = 3002

[[ports]]
localPort = 8083
externalPort = 3003
```

### 4. Build Script Overhaul (Major)

**File:** `scripts/build.js`

Major improvements to make the deployment build more reliable:

- **Separate build port:** Metro now runs on port `8083` during builds instead of `8081`, avoiding conflicts with the running dev server
- **Port cleanup:** Added `freePort()` function that kills any process occupying the build port before starting Metro
- **DevTools binary disable/restore:** Added functions to disable the React Native DevTools binary during builds (it crashes on Replit due to missing `libnspr4.so`) and restore it after
- **Improved health checks:** Metro health check now uses TCP port check first (most reliable), then HTTP endpoints as fallback
- **Longer timeout:** Download timeout increased from 5 minutes to 10 minutes for larger bundles
- All `localhost:8081` references in asset downloading, bundle URL updating, and manifest fetching changed to use the configurable `BUILD_PORT` (8083)

### 5. Gemini AI Model Upgrade

**Files:** `server/routes.ts`, `server/replit_integrations/chat/routes.ts`

Updated AI model from `gemini-2.0-flash` to `gemini-2.5-flash` in two places:

- **OCR analysis endpoint** (`/api/ocr/analyze`) — used for scanning quotes and invoices
- **Chat routes** — used for AI-powered chat responses

```diff
-model: "gemini-2.0-flash",
+model: "gemini-2.5-flash",
```

### 6. OCR Route Ordering Fix (Bug Fix)

**File:** `server/routes.ts`

The `/api/ocr/analyze` route was moved to register BEFORE the catch-all `/api` proxy middleware. Previously, OCR requests were intercepted by the generic proxy and forwarded to the external API instead of being handled locally by Gemini Vision.

### 7. ESM Module Type Declaration

**File:** `server_dist/package.json` (NEW)

Added `{"type": "module"}` so Node.js correctly handles the ESM-formatted server build output without performance warnings.

### 8. Removed Patch

**File:** `patches/expo-asset+12.0.12.patch` (DELETED)

Removed the expo-asset patch that fixed HTTPS dev server URLs. This fix is now included upstream in Expo SDK 55.

The patch contained:
```diff
- 'http://' + manifest2.extra.expoGo.debuggerHost
+ scheme + manifest2.extra.expoGo.debuggerHost
```

### 9. Documentation Updates

**File:** `replit.md`

Added deployment configuration section documenting:
- Port configuration (5000 production, 8081 dev)
- Build process (Metro bundler + esbuild)
- System dependencies (glib, zip)
- Note about removed patches
- Route ordering requirement for catch-all proxy

---

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `.replit` | Modified | Port fix, glib dep, extra port mappings |
| `scripts/build.js` | Modified | Build reliability overhaul (port 8083, DevTools disable, health checks) |
| `server/routes.ts` | Modified | Gemini model upgrade + OCR route ordering fix |
| `server/replit_integrations/chat/routes.ts` | Modified | Gemini model upgrade |
| `server_dist/package.json` | Added | ESM module type declaration |
| `replit.md` | Modified | Deployment documentation |
| `patches/expo-asset+12.0.12.patch` | Deleted | No longer needed with Expo SDK 55 |

---

## Restoration Priority After Rollback

Apply these changes in this order:

1. **Production port fix** (`.replit` — `PORT = "5000"`) — Without this, the server won't be reachable in production
2. **glib system dependency** (`.replit` — add `glib` to packages) — Prevents build crashes
3. **Build script overhaul** (`scripts/build.js`) — Makes deployment builds reliable
4. **Extra port mappings** (`.replit` — ports 8082, 8083) — Required by the new build script
5. **OCR route ordering** (`server/routes.ts`) — Move OCR route before catch-all proxy
6. **Gemini model upgrade** (`server/routes.ts` + `server/replit_integrations/chat/routes.ts`) — Better AI responses
7. **ESM module type** (`server_dist/package.json`) — Eliminates Node.js warning
8. **Remove expo-asset patch** — Already fixed upstream in Expo SDK 55
9. **Documentation updates** (`replit.md`)
