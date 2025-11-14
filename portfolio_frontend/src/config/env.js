//
// Centralized environment/config reader for the React app
//
// PUBLIC_INTERFACE
// getEnv - Returns a normalized, readonly configuration object for the frontend.
/**
 * Provides typed, validated configuration values sourced from REACT_APP_* envs.
 *
 * Variables considered (with precedence and safe defaults):
 * - apiBase: REACT_APP_API_BASE || REACT_APP_BACKEND_URL || ""
 * - frontendUrl: REACT_APP_FRONTEND_URL || window.location.origin (best-effort)
 * - wsUrl: REACT_APP_WS_URL || derive from apiBase/http(s)->ws(s) || ""
 * - nodeEnv: REACT_APP_NODE_ENV || NODE_ENV || "development"
 * - enableSourceMaps: REACT_APP_ENABLE_SOURCE_MAPS === "true" (default: nodeEnv!=="production")
 * - featureFlags: parse JSON or comma-separated list (REACT_APP_FEATURE_FLAGS) -> string[]
 * - experimentsEnabled: REACT_APP_EXPERIMENTS_ENABLED === "true"
 * - logLevel: REACT_APP_LOG_LEVEL || ("debug" if dev else "info")
 * - healthcheckPath: REACT_APP_HEALTHCHECK_PATH || "/healthz"
 * - port: number from REACT_APP_PORT || 3000
 * - trustProxy: REACT_APP_TRUST_PROXY === "true"
 *
 * Security:
 * - Never log sensitive values.
 * - Only non-sensitive diagnostics in development.
 *
 * Usage:
 *   import { getEnv } from "../config/env";
 *   const { apiBase, featureFlags } = getEnv();
 */
export function getEnv() {
  // helper to parse booleans
  const toBool = (v, fallback = false) => {
    if (v === undefined || v === null) return fallback;
    const s = String(v).trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(s)) return true;
    if (["false", "0", "no", "n", "off"].includes(s)) return false;
    return fallback;
  };

  // helper to parse integers
  const toInt = (v, fallback) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  };

  // feature flags can be JSON array or comma separated
  const parseFeatureFlags = (raw) => {
    if (!raw) return [];
    try {
      // Try JSON first
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map((x) => String(x).trim())
          .filter((x) => x.length > 0);
      }
    } catch {
      // not JSON, fall back to CSV
    }
    return String(raw)
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
  };

  // derive WS URL from API base if possible
  const deriveWsUrl = (httpUrl) => {
    if (!httpUrl) return "";
    try {
      const url = new URL(httpUrl, window.location.origin);
      if (url.protocol === "http:") url.protocol = "ws:";
      if (url.protocol === "https:") url.protocol = "wss:";
      return url.toString().replace(/\/+$/, "");
    } catch {
      return "";
    }
  };

  const nodeEnv =
    process.env.REACT_APP_NODE_ENV ||
    process.env.NODE_ENV ||
    "development";

  const apiBase =
    (process.env.REACT_APP_API_BASE || "").trim() ||
    (process.env.REACT_APP_BACKEND_URL || "").trim() ||
    "";

  // Frontend URL: prefer env, fall back to window origin if available
  let frontendUrl = (process.env.REACT_APP_FRONTEND_URL || "").trim();
  if (!frontendUrl) {
    try {
      if (typeof window !== "undefined" && window.location?.origin) {
        frontendUrl = window.location.origin;
      }
    } catch {
      // ignore SSR/window-less cases
    }
  }

  // wsUrl: prefer env, else derive from apiBase
  let wsUrl = (process.env.REACT_APP_WS_URL || "").trim();
  if (!wsUrl) {
    wsUrl = deriveWsUrl(apiBase);
  }

  const enableSourceMaps = toBool(
    process.env.REACT_APP_ENABLE_SOURCE_MAPS,
    nodeEnv !== "production"
  );

  const featureFlags = parseFeatureFlags(
    process.env.REACT_APP_FEATURE_FLAGS
  );

  const experimentsEnabled = toBool(
    process.env.REACT_APP_EXPERIMENTS_ENABLED,
    false
  );

  const logLevel =
    (process.env.REACT_APP_LOG_LEVEL || "").trim() ||
    (nodeEnv === "development" ? "debug" : "info");

  const healthcheckPath =
    (process.env.REACT_APP_HEALTHCHECK_PATH || "").trim() || "/healthz";

  const port = toInt(process.env.REACT_APP_PORT, 3000);

  const trustProxy = toBool(process.env.REACT_APP_TRUST_PROXY, false);

  const config = Object.freeze({
    apiBase: apiBase.replace(/\/+$/, ""),
    frontendUrl: frontendUrl.replace(/\/+$/, ""),
    wsUrl: wsUrl.replace(/\/+$/, ""),
    nodeEnv,
    enableSourceMaps,
    featureFlags,
    experimentsEnabled,
    logLevel,
    healthcheckPath,
    port,
    trustProxy,
  });

  // Development-only non-sensitive diagnostics
  if (nodeEnv === "development") {
    // eslint-disable-next-line no-console
    console.debug("[env] loaded config", {
      nodeEnv: config.nodeEnv,
      apiBase: config.apiBase,
      frontendUrl: config.frontendUrl,
      wsUrl: config.wsUrl,
      enableSourceMaps: config.enableSourceMaps,
      featureFlags: config.featureFlags,
      experimentsEnabled: config.experimentsEnabled,
      logLevel: config.logLevel,
      healthcheckPath: config.healthcheckPath,
      port: config.port,
      trustProxy: config.trustProxy,
    });
  }

  return config;
}

// PUBLIC_INTERFACE
// hasFeature - Checks if the given feature flag is enabled.
/**
 * Check if a feature flag is present in the configured featureFlags list.
 *
 * @param {string} flag - The feature flag name to check.
 * @returns {boolean} True if flag is enabled, false otherwise.
 */
export function hasFeature(flag) {
  if (!flag) return false;
  const { featureFlags } = getEnv();
  return featureFlags.includes(flag);
}

// PUBLIC_INTERFACE
// isExperimentEnabled - Returns whether experiments are globally enabled.
/**
 * Indicates whether experiments are globally enabled via REACT_APP_EXPERIMENTS_ENABLED.
 *
 * @returns {boolean} True if experiments are enabled.
 */
export function isExperimentEnabled() {
  const { experimentsEnabled } = getEnv();
  return experimentsEnabled;
}
