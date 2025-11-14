//
// PUBLIC_INTERFACE
// export theme tokens for consistent styling across the app
//
// These tokens mirror the style guide (#3b82f6 & #06b6d4 accents) and provide
// a single source of truth for colors, spacing, radii, shadows, and gradients.
// Use CSS variables declared in App.css for runtime theming. JS tokens are
// provided for non-CSS contexts (e.g., inline styles, calculations).
//

/**
 * PUBLIC_INTERFACE
 * getDesignTokens - Returns the theme tokens for use in JS (inline styles, calculations).
 *
 * @returns {object} A frozen object containing colors, spacing, radii, shadows, and gradients.
 */
export function getDesignTokens() {
  const tokens = {
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      success: "#06b6d4",
      error: "hsl(0 84% 60%)",
      // Base text color used in light theme by default
      text: "#111827",

      // Surfaces and backgrounds (light)
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      surface: "#ffffff",
      border: "#e5e7eb",

      // Dark scheme counterparts (used via CSS vars when data-theme="dark")
      dark: {
        bgPrimary: "#0b0f17",
        bgSecondary: "#0f172a",
        surface: "#111827",
        text: "#e5e7eb",
        border: "#1f2937",
        buttonBg: "#2563eb",
        buttonText: "#e5e7eb",
      },
    },

    spacing: {
      // 4px baseline scale
      xs: "0.25rem", // 4px
      sm: "0.5rem",  // 8px
      md: "0.75rem", // 12px
      lg: "1rem",    // 16px
      xl: "1.5rem",  // 24px
      "2xl": "2rem", // 32px
      "3xl": "3rem", // 48px
      "4xl": "4rem", // 64px
      "6xl": "6rem", // 96px
    },

    radii: {
      sm: "6px",
      md: "8px",
      lg: "10px",
      xl: "12px",
      round: "9999px",
    },

    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.06)",
      md: "0 4px 10px rgba(0,0,0,0.08)",
      lg: "0 10px 25px rgba(0,0,0,0.12)",
    },

    gradients: {
      // Subtle hero gradient similar to current style
      hero: "linear-gradient(180deg, rgba(59,130,246,0.08), transparent)",
      // Accent gradient option using primary -> success hues
      accent: "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(6,182,212,0.15))",
    },
  };

  return Object.freeze(tokens);
}

/**
 * PUBLIC_INTERFACE
 * getCssVarNames - Returns the list of CSS variable names used by the theme.
 *
 * These names should match those declared in :root / [data-theme="dark"] in App.css.
 *
 * @returns {string[]} List of variable names (without the leading '--').
 */
export function getCssVarNames() {
  return Object.freeze([
    "primary",
    "secondary",
    "success",
    "error",
    "text",
    "bg-primary",
    "bg-secondary",
    "surface",
    "border-color",
    "button-bg",
    "button-text",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "radius-sm",
    "radius-md",
    "radius-lg",
    "radius-xl",
    "radius-round",
    "space-xs",
    "space-sm",
    "space-md",
    "space-lg",
    "space-xl",
    "space-2xl",
    "space-3xl",
    "space-4xl",
    "space-6xl",
    "gradient-hero",
    "gradient-accent",
  ]);
}

/**
 * PUBLIC_INTERFACE
 * note - Developer note on how to use the tokens:
 *
 * - Prefer CSS variables in components via classes (no duplication).
 * - Use JS tokens from getDesignTokens() only for dynamic inline styles or calculations.
 */
export const note =
  "Use CSS variables for styling in components; use getDesignTokens() for JS-only contexts.";
