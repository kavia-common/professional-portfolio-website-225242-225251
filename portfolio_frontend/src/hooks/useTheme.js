import { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useTheme - manages light/dark theme with persistence and prefers-color-scheme fallback.
 *
 * Returns:
 * - theme: "light" | "dark"
 * - toggleTheme: function to switch theme
 * - setTheme: direct setter
 *
 * Accessibility:
 * - Updates documentElement data-theme attribute for CSS and prefers-reduced-motion respects transitions in CSS.
 *
 * Env:
 * - REACT_APP_NODE_ENV can be used for debug logging (non-sensitive).
 */
export function useTheme(defaultTheme = "light") {
  const getInitialTheme = () => {
    try {
      const saved = window.localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : defaultTheme;
    } catch {
      return defaultTheme;
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // ignore storage failures
    }
    if (process.env.REACT_APP_NODE_ENV === "development") {
      // Non-sensitive, dev-only
      // eslint-disable-next-line no-console
      console.debug("[Theme] set:", theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return { theme, toggleTheme, setTheme };
}
