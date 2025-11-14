//
// Lightweight, tree-shakable logger with level gating and safe formatting
//
// PUBLIC_INTERFACE
// getLogger - Returns a logger instance configured by environment.
//
// Usage:
//   import { getLogger } from "../utils/logger";
//   const logger = getLogger("Contact");
//   logger.info("submit_clicked", { nonSensitive: true });
//
// Levels: error (0), warn (1), info (2), debug (3)
//
// Sensitive-data handling:
// - Logger never logs raw objects without filtering.
// - It masks values if a key appears sensitive by name.
// - It truncates long strings to avoid payload dumps.
// - It respects REACT_APP_LOG_LEVEL, defaulting based on env.
//
import { getEnv } from "../config/env";

const LEVELS = Object.freeze({
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
});

// Heuristic list of keys that may contain sensitive data
const SENSITIVE_KEYS = [
  "password",
  "pass",
  "token",
  "authorization",
  "auth",
  "secret",
  "apikey",
  "api_key",
  "ssn",
  "creditcard",
  "card",
  "email", // treat email as sensitive for logging
  "phone",
];

/**
 * Safely stringify metadata for logging:
 * - Masks sensitive fields by key
 * - Limits string length
 * - Limits depth to avoid dumping large structures
 */
function safeSerialize(value, depth = 0) {
  const MAX_DEPTH = 2;
  const MAX_LEN = 300;

  try {
    if (value == null) return value;
    if (typeof value === "string") {
      return value.length > MAX_LEN ? `${value.slice(0, MAX_LEN)}…[truncated]` : value;
    }
    if (typeof value !== "object") return value;

    if (Array.isArray(value)) {
      if (depth >= MAX_DEPTH) return "[Array]";
      return value.slice(0, 10).map((v) => safeSerialize(v, depth + 1));
    }

    if (depth >= MAX_DEPTH) return "[Object]";

    const out = {};
    const keys = Object.keys(value).slice(0, 15);
    for (const k of keys) {
      if (SENSITIVE_KEYS.some((sk) => k.toLowerCase().includes(sk))) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = safeSerialize(value[k], depth + 1);
      }
    }
    return out;
  } catch {
    return "[Unserializable]";
  }
}

/**
 * Create a no-op function for disabled levels to keep bundles smaller after minification.
 */
function noop() {}

/**
 * INTERNAL: Create a logger with the provided level threshold and namespace.
 */
function createLogger(thresholdLevel, namespace) {
  const prefix = namespace ? `[${namespace}]` : "";

  const emit = (method, level, message, meta) => {
    if (LEVELS[level] > thresholdLevel) return;
    const ts = new Date().toISOString();

    // Only include safe, minimal metadata
    const safeMeta = meta ? safeSerialize(meta) : undefined;

    // Use appropriate console method
    // eslint-disable-next-line no-console
    const writer = console[method] || console.log;

    // Structured-ish line, compact for production
    if (safeMeta !== undefined) {
      writer(`${ts} ${prefix} ${level.toUpperCase()}: ${message}`, safeMeta);
    } else {
      writer(`${ts} ${prefix} ${level.toUpperCase()}: ${message}`);
    }
  };

  return {
    // PUBLIC_INTERFACE
    /**
     * Logs an error message.
     * @param {string} message - Short, non-sensitive message.
     * @param {object} [meta] - Optional non-PII metadata.
     */
    error: LEVELS.error <= thresholdLevel ? (message, meta) => emit("error", "error", message, meta) : noop,

    // PUBLIC_INTERFACE
    /**
     * Logs a warning message.
     * @param {string} message - Short, non-sensitive message.
     * @param {object} [meta] - Optional non-PII metadata.
     */
    warn: LEVELS.warn <= thresholdLevel ? (message, meta) => emit("warn", "warn", message, meta) : noop,

    // PUBLIC_INTERFACE
    /**
     * Logs an informational message.
     * @param {string} message - Short, non-sensitive message.
     * @param {object} [meta] - Optional non-PII metadata.
     */
    info: LEVELS.info <= thresholdLevel ? (message, meta) => emit("info", "info", message, meta) : noop,

    // PUBLIC_INTERFACE
    /**
     * Logs a debug message.
     * @param {string} message - Short, non-sensitive message.
     * @param {object} [meta] - Optional non-PII metadata.
     */
    debug: LEVELS.debug <= thresholdLevel ? (message, meta) => emit("debug", "debug", message, meta) : noop,
  };
}

// PUBLIC_INTERFACE
/**
 * Returns a logger instance configured by environment log level.
 *
 * Level derivation:
 * - from getEnv().logLevel (REACT_APP_LOG_LEVEL) among: error,warn,info,debug
 * - defaults to "info" in production and "debug" in development per env.js
 *
 * @param {string} [namespace] - Optional component/feature namespace label.
 * @returns {{error:Function, warn:Function, info:Function, debug:Function}}
 */
export function getLogger(namespace) {
  const env = getEnv();
  const rawLevel = (env.logLevel || "info").toLowerCase();
  const threshold = LEVELS[rawLevel] ?? LEVELS.info;
  return createLogger(threshold, namespace);
}
