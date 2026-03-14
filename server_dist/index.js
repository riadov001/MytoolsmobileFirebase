// server/index.ts
import express from "express";

// server/routes.ts
import { createServer } from "node:http";
import pg from "pg";
var EXTERNAL_API = "https://saas.mytoolsgroup.eu";
var pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
async function registerRoutes(app2) {
  app2.delete("/api/users/me", async (req, res) => {
    try {
      const headers = {
        "host": new URL(EXTERNAL_API).host
      };
      if (req.headers["cookie"]) {
        headers["cookie"] = req.headers["cookie"];
      }
      if (req.headers["authorization"]) {
        headers["authorization"] = req.headers["authorization"];
      }
      const userRes = await fetch(`${EXTERNAL_API}/api/auth/user`, {
        method: "GET",
        headers,
        redirect: "manual"
      });
      if (!userRes.ok) {
        return res.status(401).json({ message: "Non authentifi\xE9. Veuillez vous reconnecter." });
      }
      const userData = await userRes.json();
      const userId = userData?.id || userData?.user?.id || userData?._id;
      const userEmail = userData?.email || userData?.user?.email;
      if (!userId) {
        return res.status(400).json({ message: "Impossible d'identifier l'utilisateur." });
      }
      const existing = await pool.query(
        "SELECT id FROM deleted_accounts WHERE external_user_id = $1 OR email = $2",
        [String(userId), userEmail || ""]
      );
      if (existing.rows.length > 0) {
        return res.status(200).json({ message: "Compte d\xE9j\xE0 supprim\xE9." });
      }
      await pool.query(
        "INSERT INTO deleted_accounts (external_user_id, email, user_data) VALUES ($1, $2, $3)",
        [String(userId), userEmail || null, JSON.stringify(userData)]
      );
      try {
        await fetch(`${EXTERNAL_API}/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: { ...headers, "content-type": "application/json" },
          redirect: "manual"
        });
      } catch {
      }
      try {
        await fetch(`${EXTERNAL_API}/api/logout`, {
          method: "POST",
          headers,
          redirect: "manual"
        });
      } catch {
      }
      console.log(`Account deletion recorded: userId=${userId}, email=${userEmail}`);
      return res.status(200).json({ message: "Compte supprim\xE9 avec succ\xE8s." });
    } catch (err) {
      console.error("Account deletion error:", err.message);
      return res.status(502).json({ message: "Erreur de connexion au serveur. Veuillez r\xE9essayer." });
    }
  });
  app2.post("/api/login", async (req, res) => {
    try {
      const email = req.body?.email;
      if (email) {
        const deleted = await pool.query(
          "SELECT id FROM deleted_accounts WHERE email = $1",
          [email]
        );
        if (deleted.rows.length > 0) {
          return res.status(403).json({
            message: "Ce compte a \xE9t\xE9 supprim\xE9. Il n'est plus possible de se connecter."
          });
        }
      }
      const targetUrl = `${EXTERNAL_API}/api/login`;
      const headers = {
        "host": new URL(EXTERNAL_API).host,
        "content-type": "application/json"
      };
      if (req.headers["cookie"]) {
        headers["cookie"] = req.headers["cookie"];
      }
      const response = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(req.body),
        redirect: "manual"
      });
      response.headers.forEach((value, key) => {
        const lk = key.toLowerCase();
        if (lk === "transfer-encoding" || lk === "content-encoding") return;
        if (lk === "set-cookie") {
          res.appendHeader("set-cookie", value);
          return;
        }
        res.setHeader(key, value);
      });
      res.status(response.status);
      if (response.ok) {
        const responseData = await response.json();
        const loggedInUserId = responseData?.id || responseData?.user?.id || responseData?._id;
        const loggedInEmail = responseData?.email || responseData?.user?.email;
        if (loggedInUserId || loggedInEmail) {
          const deletedById = loggedInUserId ? await pool.query("SELECT id FROM deleted_accounts WHERE external_user_id = $1", [String(loggedInUserId)]) : { rows: [] };
          const deletedByEmail = loggedInEmail ? await pool.query("SELECT id FROM deleted_accounts WHERE email = $1", [loggedInEmail]) : { rows: [] };
          if (deletedById.rows.length > 0 || deletedByEmail.rows.length > 0) {
            try {
              await fetch(`${EXTERNAL_API}/api/logout`, {
                method: "POST",
                headers: { "host": new URL(EXTERNAL_API).host, ...req.headers["cookie"] ? { "cookie": req.headers["cookie"] } : {} },
                redirect: "manual"
              });
            } catch {
            }
            return res.status(403).json({
              message: "Ce compte a \xE9t\xE9 supprim\xE9. Il n'est plus possible de se connecter."
            });
          }
        }
        return res.json(responseData);
      }
      const body = await response.arrayBuffer();
      res.send(Buffer.from(body));
    } catch (err) {
      console.error("Login proxy error:", err.message);
      res.status(502).json({ message: "Erreur de connexion au serveur API" });
    }
  });
  app2.use("/api", async (req, res, next) => {
    try {
      const targetUrl = `${EXTERNAL_API}/api${req.url}`;
      const headers = {
        "host": new URL(EXTERNAL_API).host
      };
      if (req.headers["content-type"]) {
        headers["content-type"] = req.headers["content-type"];
      }
      if (req.headers["cookie"]) {
        headers["cookie"] = req.headers["cookie"];
      }
      if (req.headers["authorization"]) {
        headers["authorization"] = req.headers["authorization"];
      }
      const fetchOptions = {
        method: req.method,
        headers,
        redirect: "manual"
      };
      if (req.method !== "GET" && req.method !== "HEAD") {
        const contentType = req.headers["content-type"] || "";
        if (contentType.includes("application/json")) {
          fetchOptions.body = JSON.stringify(req.body);
        } else if (contentType.includes("multipart/form-data")) {
          fetchOptions.body = req.rawBody;
          headers["content-type"] = contentType;
        } else if (contentType.includes("urlencoded")) {
          const params = new URLSearchParams(req.body);
          fetchOptions.body = params.toString();
        } else if (req.rawBody) {
          fetchOptions.body = req.rawBody;
        } else {
          fetchOptions.body = JSON.stringify(req.body);
          headers["content-type"] = "application/json";
        }
      }
      const response = await fetch(targetUrl, fetchOptions);
      response.headers.forEach((value, key) => {
        const lk = key.toLowerCase();
        if (lk === "transfer-encoding") return;
        if (lk === "content-encoding") return;
        if (lk === "set-cookie") {
          res.appendHeader("set-cookie", value);
          return;
        }
        res.setHeader(key, value);
      });
      res.status(response.status);
      const body = await response.arrayBuffer();
      res.send(Buffer.from(body));
    } catch (err) {
      console.error("API proxy error:", err.message);
      res.status(502).json({ message: "Erreur de connexion au serveur API" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import * as fs from "fs";
import * as path from "path";
var app = express();
var log = console.log;
function setupCors(app2) {
  app2.use((req, res, next) => {
    const origins = /* @__PURE__ */ new Set();
    if (process.env.REPLIT_DEV_DOMAIN) {
      origins.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
    }
    if (process.env.REPLIT_DOMAINS) {
      process.env.REPLIT_DOMAINS.split(",").forEach((d) => {
        origins.add(`https://${d.trim()}`);
      });
    }
    const origin = req.header("origin");
    const isLocalhost = origin?.startsWith("http://localhost:") || origin?.startsWith("http://127.0.0.1:");
    if (origin && (origins.has(origin) || isLocalhost)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
}
function setupBodyParsing(app2) {
  app2.use((req, _res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => {
        req.rawBody = Buffer.concat(chunks);
        next();
      });
      req.on("error", next);
    } else {
      next();
    }
  });
  app2.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      }
    })
  );
  app2.use(express.urlencoded({ extended: false }));
}
function setupRequestLogging(app2) {
  app2.use((req, res, next) => {
    const start = Date.now();
    const path2 = req.path;
    let capturedJsonResponse = void 0;
    const originalResJson = res.json;
    res.json = function(bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
      if (!path2.startsWith("/api")) return;
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    });
    next();
  });
}
function getAppName() {
  try {
    const appJsonPath = path.resolve(process.cwd(), "app.json");
    const appJsonContent = fs.readFileSync(appJsonPath, "utf-8");
    const appJson = JSON.parse(appJsonContent);
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}
function serveExpoManifest(platform, res) {
  const manifestPath = path.resolve(
    process.cwd(),
    "static-build",
    platform,
    "manifest.json"
  );
  if (!fs.existsSync(manifestPath)) {
    return res.status(404).json({ error: `Manifest not found for platform: ${platform}` });
  }
  res.setHeader("expo-protocol-version", "1");
  res.setHeader("expo-sfv-version", "0");
  res.setHeader("content-type", "application/json");
  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.send(manifest);
}
function serveLandingPage({
  req,
  res,
  landingPageTemplate,
  appName
}) {
  const forwardedProto = req.header("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol || "https";
  const forwardedHost = req.header("x-forwarded-host");
  const host = forwardedHost || req.get("host");
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;
  log(`baseUrl`, baseUrl);
  log(`expsUrl`, expsUrl);
  const html = landingPageTemplate.replace(/BASE_URL_PLACEHOLDER/g, baseUrl).replace(/EXPS_URL_PLACEHOLDER/g, expsUrl).replace(/APP_NAME_PLACEHOLDER/g, appName);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
function configureExpoAndLanding(app2) {
  const templatePath = path.resolve(
    process.cwd(),
    "server",
    "templates",
    "landing-page.html"
  );
  let landingPageTemplate = "";
  try {
    landingPageTemplate = fs.readFileSync(templatePath, "utf-8");
  } catch {
    log("Warning: landing-page.html not found, using fallback");
    landingPageTemplate = "<!DOCTYPE html><html><body><h1>MyJantes App</h1></body></html>";
  }
  const appName = getAppName();
  log("Serving static Expo files with dynamic manifest routing");
  app2.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    if (req.path !== "/" && req.path !== "/manifest") {
      return next();
    }
    const platform = req.header("expo-platform");
    if (platform && (platform === "ios" || platform === "android")) {
      return serveExpoManifest(platform, res);
    }
    if (req.path === "/") {
      try {
        return serveLandingPage({
          req,
          res,
          landingPageTemplate,
          appName
        });
      } catch (err) {
        log("Landing page error:", err);
        return res.status(200).send("<!DOCTYPE html><html><body><h1>MyJantes</h1></body></html>");
      }
    }
    next();
  });
  app2.use("/assets", express.static(path.resolve(process.cwd(), "assets")));
  const staticBuildPath = path.resolve(process.cwd(), "static-build");
  if (fs.existsSync(staticBuildPath)) {
    app2.use(express.static(staticBuildPath));
  } else {
    log("Warning: static-build directory not found, skipping static file serving");
  }
  log("Expo routing: Checking expo-platform header on / and /manifest");
}
function setupErrorHandler(app2) {
  app2.use((err, _req, res, next) => {
    const error = err;
    const status = error.status || error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });
}
(async () => {
  setupCors(app);
  setupBodyParsing(app);
  setupRequestLogging(app);
  configureExpoAndLanding(app);
  const server = await registerRoutes(app);
  setupErrorHandler(app);
  const port = process.env.NODE_ENV === "production" ? parseInt(process.env.PORT || "8081", 10) : 5e3;
  log(`express server serving on port ${port}`);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`express server serving on port ${port}`);
    }
  );
})();
