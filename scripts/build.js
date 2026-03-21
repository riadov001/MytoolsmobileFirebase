const fs = require("fs");
const path = require("path");
const { spawn, execSync } = require("child_process");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

const BUILD_PORT = 8083;

let metroProcess = null;

function exitWithError(message) {
  console.error(message);
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(1);
}

function setupSignalHandlers() {
  const cleanup = () => {
    if (metroProcess) {
      console.log("Cleaning up Metro process...");
      metroProcess.kill();
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
}

function stripProtocol(domain) {
  let urlString = domain.trim();

  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  return new URL(urlString).host;
}

function getDeploymentDomain() {
  // Check Replit deployment environment variables first
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return stripProtocol(process.env.REPLIT_INTERNAL_APP_DOMAIN);
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    return stripProtocol(process.env.REPLIT_DEV_DOMAIN);
  }

  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return stripProtocol(process.env.EXPO_PUBLIC_DOMAIN);
  }

  console.error(
    "ERROR: No deployment domain found. Set REPLIT_INTERNAL_APP_DOMAIN, REPLIT_DEV_DOMAIN, or EXPO_PUBLIC_DOMAIN",
  );
  process.exit(1);
}

function prepareDirectories(timestamp) {
  console.log("Preparing build directories...");

  if (fs.existsSync("static-build")) {
    fs.rmSync("static-build", { recursive: true });
  }

  const dirs = [
    path.join("static-build", timestamp, "_expo", "static", "js", "ios"),
    path.join("static-build", timestamp, "_expo", "static", "js", "android"),
    path.join("static-build", "ios"),
    path.join("static-build", "android"),
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log("Build:", timestamp);
}

function clearMetroCache() {
  console.log("Clearing Metro cache...");

  const cacheDirs = [
    ...fs.globSync(".metro-cache"),
    ...fs.globSync("node_modules/.cache/metro"),
  ];

  for (const dir of cacheDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  console.log("Cache cleared");
}

async function checkMetroHealth() {
  // First try TCP port check (most reliable)
  const tcpReady = await new Promise((resolve) => {
    const net = require("net");
    const socket = new net.Socket();
    const timer = setTimeout(() => { socket.destroy(); resolve(false); }, 2000);
    socket.connect(BUILD_PORT, "127.0.0.1", () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => { clearTimeout(timer); resolve(false); });
  });
  if (!tcpReady) return false;

  // Then verify it responds to HTTP
  const endpoints = [
    `http://localhost:${BUILD_PORT}/status`,
    `http://localhost:${BUILD_PORT}/`,
  ];
  for (const url of endpoints) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (response.status < 500) return true;
    } catch {
      // try next
    }
  }
  // Port is open, accept it even if HTTP check failed
  return tcpReady;
}

function disableDevToolsBinary() {
  const devtoolsBin = path.resolve(
    process.cwd(),
    "node_modules",
    "@react-native",
    "debugger-shell",
    "bin",
    "react-native-devtools"
  );
  const backupBin = devtoolsBin + ".bak";
  try {
    if (!fs.existsSync(devtoolsBin)) {
      // Binary doesn't exist at all — nothing to do
      return;
    }
    if (fs.existsSync(backupBin)) {
      // Already disabled from a previous run (backup exists)
      console.log("React Native DevTools binary already disabled");
      return;
    }
    const content = fs.readFileSync(devtoolsBin);
    if (content.toString("utf-8", 0, 10).startsWith("#!/bin/sh")) {
      // Already a no-op script — mark it so restore knows
      console.log("React Native DevTools binary already a no-op");
      return;
    }
    fs.writeFileSync(backupBin, content, { mode: 0o755 });
    fs.writeFileSync(devtoolsBin, "#!/bin/sh\nexit 0\n", { mode: 0o755 });
    console.log("Disabled React Native DevTools binary for build");
  } catch (err) {
    console.log("Warning: Could not disable DevTools binary:", err.message);
  }
}

function restoreDevToolsBinary() {
  const devtoolsBin = path.resolve(
    process.cwd(),
    "node_modules",
    "@react-native",
    "debugger-shell",
    "bin",
    "react-native-devtools"
  );
  const backupBin = devtoolsBin + ".bak";
  try {
    if (fs.existsSync(backupBin)) {
      const original = fs.readFileSync(backupBin);
      fs.writeFileSync(devtoolsBin, original, { mode: 0o755 });
      fs.unlinkSync(backupBin);
      console.log("Restored React Native DevTools binary");
    }
  } catch (err) {
    console.log("Warning: Could not restore DevTools binary:", err.message);
  }
}

function freePort(port) {
  try {
    const pids = execSync(`lsof -t -i :${port} 2>/dev/null`, { encoding: "utf-8" })
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    if (pids.length > 0) {
      console.log(`Freeing port ${port} (PIDs: ${pids.join(", ")})...`);
      for (const pid of pids) {
        try {
          process.kill(parseInt(pid, 10), "SIGKILL");
        } catch {}
      }
      execSync("sleep 1");
      console.log(`Port ${port} freed`);
    }
  } catch {
    // lsof not available or no process — that's fine
  }
}

async function startMetro(expoPublicDomain) {
  const isRunning = await checkMetroHealth();
  if (isRunning) {
    console.log("Metro already running");
    return;
  }

  freePort(BUILD_PORT);
  disableDevToolsBinary();

  console.log(`Starting Metro on port ${BUILD_PORT}...`);
  console.log(`Setting EXPO_PUBLIC_DOMAIN=${expoPublicDomain}`);
  const env = {
    ...process.env,
    EXPO_PUBLIC_DOMAIN: expoPublicDomain,
    CI: "1",
    EXPO_NO_TELEMETRY: "1",
    REACT_NATIVE_DEVTOOLS_DISABLED: "true",
  };
  metroProcess = spawn(
    "npx",
    ["expo", "start", "--no-dev", "--minify", "--localhost", "--port", String(BUILD_PORT)],
    {
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
      env,
    },
  );

  if (metroProcess.stdout) {
    metroProcess.stdout.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.log(`[Metro] ${output}`);
    });
  }
  if (metroProcess.stderr) {
    metroProcess.stderr.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.error(`[Metro Error] ${output}`);
    });
  }

  for (let i = 0; i < 120; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const healthy = await checkMetroHealth();
    if (healthy) {
      console.log("Metro ready");
      return;
    }

    if (i > 0 && i % 30 === 0) {
      console.log(`Still waiting for Metro... (${i}s)`);
    }
  }

  console.error("Metro timeout after 120s");
  process.exit(1);
}

async function downloadFile(url, outputPath) {
  const controller = new AbortController();
  const fiveMinMS = 5 * 60 * 1_000;
  const timeoutId = setTimeout(() => controller.abort(), fiveMinMS);

  try {
    console.log(`Downloading: ${url}`);
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const file = fs.createWriteStream(outputPath);
    await pipeline(Readable.fromWeb(response.body), file);

    const fileSize = fs.statSync(outputPath).size;

    if (fileSize === 0) {
      fs.unlinkSync(outputPath);
      throw new Error("Downloaded file is empty");
    }
  } catch (error) {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    if (error.name === "AbortError") {
      throw new Error(`Download timeout after 5m: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function downloadBundle(platform, timestamp) {
  // For expo-router apps, the entry is node_modules/expo-router/entry
  const url = new URL(`http://localhost:${BUILD_PORT}/node_modules/expo-router/entry.bundle`);
  url.searchParams.set("platform", platform);
  url.searchParams.set("dev", "false");
  url.searchParams.set("hot", "false");
  url.searchParams.set("lazy", "false");
  url.searchParams.set("minify", "true");

  const output = path.join(
    "static-build",
    timestamp,
    "_expo",
    "static",
    "js",
    platform,
    "bundle.js",
  );

  console.log(`Fetching ${platform} bundle...`);
  await downloadFile(url.toString(), output);
  console.log(`${platform} bundle ready`);
}

async function downloadManifest(platform) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300_000);

  try {
    console.log(`Fetching ${platform} manifest...`);
    const response = await fetch(`http://localhost:${BUILD_PORT}/manifest`, {
      headers: { "expo-platform": platform },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const manifest = await response.json();
    console.log(`${platform} manifest ready`);
    return manifest;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `Manifest download timeout after 5m for platform: ${platform}`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function downloadBundlesAndManifests(timestamp) {
  console.log("Downloading bundles and manifests...");
  console.log("This may take several minutes for production builds...");

  try {
    const results = await Promise.allSettled([
      downloadBundle("ios", timestamp),
      downloadBundle("android", timestamp),
      downloadManifest("ios"),
      downloadManifest("android"),
    ]);

    const failures = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === "rejected");

    if (failures.length > 0) {
      const errorMessages = failures.map(({ result, index }) => {
        const names = [
          "iOS bundle",
          "Android bundle",
          "iOS manifest",
          "Android manifest",
        ];
        return `  - ${names[index]}: ${result.reason?.message || result.reason}`;
      });

      exitWithError(`Download failed:\n${errorMessages.join("\n")}`);
    }

    const iosManifest =
      results[2].status === "fulfilled" ? results[2].value : null;
    const androidManifest =
      results[3].status === "fulfilled" ? results[3].value : null;

    console.log("All downloads completed successfully");
    return { ios: iosManifest, android: androidManifest };
  } catch (error) {
    exitWithError(`Unexpected download error: ${error.message}`);
  }
}

function extractAssets(timestamp) {
  const bundles = {
    ios: fs.readFileSync(
      path.join(
        "static-build",
        timestamp,
        "_expo",
        "static",
        "js",
        "ios",
        "bundle.js",
      ),
      "utf-8",
    ),
    android: fs.readFileSync(
      path.join(
        "static-build",
        timestamp,
        "_expo",
        "static",
        "js",
        "android",
        "bundle.js",
      ),
      "utf-8",
    ),
  };

  const assetsMap = new Map();
  const assetPattern =
    /httpServerLocation:"([^"]+)"[^}]*hash:"([^"]+)"[^}]*name:"([^"]+)"[^}]*type:"([^"]+)"/g;

  const extractFromBundle = (bundle, platform) => {
    for (const match of bundle.matchAll(assetPattern)) {
      const originalPath = match[1];
      const filename = match[3] + "." + match[4];

      const tempUrl = new URL(`http://localhost:${BUILD_PORT}${originalPath}`);
      const unstablePath = tempUrl.searchParams.get("unstable_path");

      if (!unstablePath) {
        throw new Error(`Asset missing unstable_path: ${originalPath}`);
      }

      const decodedPath = decodeURIComponent(unstablePath);
      const key = path.posix.join(decodedPath, filename);

      if (!assetsMap.has(key)) {
        const asset = {
          url: path.posix.join("/", decodedPath, filename),
          originalPath: originalPath,
          filename: filename,
          relativePath: decodedPath,
          hash: match[2],
          platforms: new Set(),
        };

        assetsMap.set(key, asset);
      }
      assetsMap.get(key).platforms.add(platform);
    }
  };

  extractFromBundle(bundles.ios, "ios");
  extractFromBundle(bundles.android, "android");

  return Array.from(assetsMap.values());
}

async function downloadAssets(assets, timestamp) {
  if (assets.length === 0) {
    return 0;
  }

  console.log("Downloading assets...");
  let successCount = 0;
  const failures = [];

  const downloadPromises = assets.map(async (asset) => {
    const platform = Array.from(asset.platforms)[0];

    const tempUrl = new URL(`http://localhost:${BUILD_PORT}${asset.originalPath}`);
    const unstablePath = tempUrl.searchParams.get("unstable_path");

    if (!unstablePath) {
      throw new Error(`Asset missing unstable_path: ${asset.originalPath}`);
    }

    const decodedPath = decodeURIComponent(unstablePath);
    const metroUrl = new URL(
      `http://localhost:${BUILD_PORT}${path.posix.join("/assets", decodedPath, asset.filename)}`,
    );
    metroUrl.searchParams.set("platform", platform);
    metroUrl.searchParams.set("hash", asset.hash);

    const outputDir = path.join(
      "static-build",
      timestamp,
      "_expo",
      "static",
      "js",
      asset.relativePath,
    );
    fs.mkdirSync(outputDir, { recursive: true });
    const output = path.join(outputDir, asset.filename);

    try {
      await downloadFile(metroUrl.toString(), output);
      successCount++;
    } catch (error) {
      failures.push({
        filename: asset.filename,
        error: error.message,
        url: metroUrl.toString(),
      });
    }
  });

  await Promise.all(downloadPromises);

  if (failures.length > 0) {
    const errorMsg =
      `Failed to download ${failures.length} asset(s):\n` +
      failures
        .map((f) => `  - ${f.filename}: ${f.error} (${f.url})`)
        .join("\n");
    exitWithError(errorMsg);
  }

  console.log(`Downloaded ${successCount} assets`);
  return successCount;
}

function updateBundleUrls(timestamp, baseUrl) {
  const updateForPlatform = (platform) => {
    const bundlePath = path.join(
      "static-build",
      timestamp,
      "_expo",
      "static",
      "js",
      platform,
      "bundle.js",
    );
    let bundle = fs.readFileSync(bundlePath, "utf-8");

    bundle = bundle.replace(
      /httpServerLocation:"(\/[^"]+)"/g,
      (_match, capturedPath) => {
        const tempUrl = new URL(`http://localhost:${BUILD_PORT}${capturedPath}`);
        const unstablePath = tempUrl.searchParams.get("unstable_path");

        if (!unstablePath) {
          throw new Error(
            `Asset missing unstable_path in bundle: ${capturedPath}`,
          );
        }

        const decodedPath = decodeURIComponent(unstablePath);
        return `httpServerLocation:"${baseUrl}/${timestamp}/_expo/static/js/${decodedPath}"`;
      },
    );

    fs.writeFileSync(bundlePath, bundle);
  };

  updateForPlatform("ios");
  updateForPlatform("android");
  console.log("Updated bundle URLs");
}

function updateManifests(manifests, timestamp, baseUrl, assetsByHash) {
  const updateForPlatform = (platform, manifest) => {
    if (!manifest.launchAsset || !manifest.extra) {
      exitWithError(`Malformed manifest for ${platform}`);
    }

    manifest.launchAsset.url = `${baseUrl}/${timestamp}/_expo/static/js/${platform}/bundle.js`;
    manifest.launchAsset.key = `bundle-${timestamp}`;
    manifest.createdAt = new Date(
      Number(timestamp.split("-")[0]),
    ).toISOString();
    manifest.extra.expoClient.hostUri =
      baseUrl.replace("https://", "") + "/" + platform;
    manifest.extra.expoGo.debuggerHost =
      baseUrl.replace("https://", "") + "/" + platform;
    manifest.extra.expoGo.packagerOpts.dev = false;

    if (manifest.assets && manifest.assets.length > 0) {
      manifest.assets.forEach((asset) => {
        if (!asset.url) return;

        const hash = asset.hash;
        if (!hash) return;

        const assetInfo = assetsByHash.get(hash);
        if (!assetInfo) return;

        asset.url = `${baseUrl}/${timestamp}/_expo/static/js/${assetInfo.relativePath}/${assetInfo.filename}`;
      });
    }

    fs.writeFileSync(
      path.join("static-build", platform, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
  };

  updateForPlatform("ios", manifests.ios);
  updateForPlatform("android", manifests.android);
  console.log("Manifests updated");
}

async function main() {
  console.log("Building static Expo Go deployment...");

  setupSignalHandlers();

  const domain = getDeploymentDomain();
  const baseUrl = `https://${domain}`;
  const timestamp = `${Date.now()}-${process.pid}`;

  prepareDirectories(timestamp);
  clearMetroCache();

  await startMetro(domain);

  const downloadTimeout = 600000;
  const downloadPromise = downloadBundlesAndManifests(timestamp);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Overall download timeout after ${downloadTimeout / 1000} seconds. ` +
            "Metro may be struggling to generate bundles. Check Metro logs above.",
        ),
      );
    }, downloadTimeout);
  });

  const manifests = await Promise.race([downloadPromise, timeoutPromise]);

  console.log("Processing assets...");
  const assets = extractAssets(timestamp);
  console.log("Found", assets.length, "unique asset(s)");

  const assetsByHash = new Map();
  for (const asset of assets) {
    assetsByHash.set(asset.hash, {
      relativePath: asset.relativePath,
      filename: asset.filename,
    });
  }

  const assetCount = await downloadAssets(assets, timestamp);

  if (assetCount > 0) {
    updateBundleUrls(timestamp, baseUrl);
  }

  console.log("Updating manifests and creating landing page...");
  updateManifests(manifests, timestamp, baseUrl, assetsByHash);

  console.log("Build complete! Deploy to:", baseUrl);

  restoreDevToolsBinary();
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(0);
}

main().catch((error) => {
  console.error("Build failed:", error.message);
  restoreDevToolsBinary();
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(1);
});
