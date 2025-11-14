# Portfolio Frontend (React)

This is a single‑page React application for a personal portfolio. It showcases projects, skills, experience, and provides a contact form. The UI follows a modern, accessible design with light/dark themes, smooth scrolling, and keyboard‑friendly navigation. The codebase is intentionally lightweight and uses plain CSS with CSS variables for theming.

## Project Overview

The app renders the following sections:
- Navigation bar with anchor links and a theme toggle
- Hero introduction with call‑to‑action buttons
- Projects grid powered by local JSON data
- Skills grouped by category
- Experience timeline
- Accessible Contact form with client‑side validation and optional API submission

Key files and directories:
- src/App.js – App root composing sections
- src/components/* – Section components (NavBar, Hero, Projects, Skills, Experience, Contact, Section)
- src/data/projects.json – Content source for the Projects section
- src/config/env.js – Centralized environment/config reader
- src/hooks/* – Custom hooks for theming, smooth scroll, and scroll spy
- src/theme.js – Design tokens and CSS variable names
- src/App.css and src/index.css – Styles and theme variables
- src/__tests__/* – Tests for navigation, theme toggle, and contact form

## Getting Started

In the project directory:

### Development server
- npm start
- Open http://localhost:3000

Environment variables with REACT_APP_ prefix can be placed in a .env file at the project root and are read at build time by Create React App.

### Run tests
- npm test

The test suite uses React Testing Library and covers:
- Navigation and section rendering/focus behavior
- Theme toggle and persistence to localStorage
- Contact form validation and submission paths (with and without API)

See “Testing” for details on mocking fetch and environment.

### Production build
- npm run build

Outputs an optimized build to the build/ folder.

## Environment Configuration

The application reads configuration from REACT_APP_* variables via src/config/env.js. The getEnv() function normalizes and returns a readonly config object.

Supported variables and behavior:
- REACT_APP_API_BASE
  - Purpose: Base URL for the contact API endpoint. If provided, Contact form POSTs JSON to ${REACT_APP_API_BASE}/contact.
  - Default: "" (empty). In this case, the Contact form gracefully falls back to a mailto flow with explicit guidance to the user.
- REACT_APP_BACKEND_URL
  - Purpose: Alternative source for API base if REACT_APP_API_BASE is not set.
  - Default: "".
- REACT_APP_FRONTEND_URL
  - Purpose: Public URL for the frontend (used as a reference value).
  - Default: window.location.origin (best‑effort).
- REACT_APP_WS_URL
  - Purpose: WebSocket base URL if applicable.
  - Default: If not set, it is derived from apiBase by mapping http(s) → ws(s).
- REACT_APP_NODE_ENV
  - Purpose: Environment label for the app. Enables some development logs when "development".
  - Default: NODE_ENV or "development".
- REACT_APP_ENABLE_SOURCE_MAPS
  - Purpose: Toggle source maps.
  - Values: "true" or "false".
  - Default: true in non‑production, false in production.
- REACT_APP_FEATURE_FLAGS
  - Purpose: Enable optional features by name.
  - Format: Either a JSON array string (e.g., ["betaBanner","newNav"]) or a comma‑separated list (e.g., betaBanner,newNav).
  - Exposed via getEnv().featureFlags and helpers hasFeature(flag) and isExperimentEnabled().
- REACT_APP_EXPERIMENTS_ENABLED
  - Purpose: Global switch for experimental features.
  - Values: "true" or "false".
  - Default: false.
- REACT_APP_LOG_LEVEL
  - Purpose: Client‑side log level for src/utils/logger.js ("error"|"warn"|"info"|"debug").
  - Default: "debug" in development; "info" otherwise.
- REACT_APP_HEALTHCHECK_PATH
  - Purpose: Path for health checks if needed by hosting (not used directly by components, exposed via env).
  - Default: "/healthz".
- REACT_APP_PORT
  - Purpose: Port number reference (useful for containerized hosting metadata).
  - Default: 3000.
- REACT_APP_TRUST_PROXY
  - Purpose: Boolean hint for proxy trust scenarios (exposed via env if needed).
  - Values: "true" or "false".
  - Default: false.

How env/config is read:
- The app imports getEnv() (src/config/env.js), which reads process.env.REACT_APP_* variables at build time and returns a frozen configuration object with:
  - apiBase, frontendUrl, wsUrl, nodeEnv, enableSourceMaps, featureFlags, experimentsEnabled, logLevel, healthcheckPath, port, trustProxy
- Helpers:
  - hasFeature(flag: string): boolean
  - isExperimentEnabled(): boolean

Example .env (do not commit real secrets):
REACT_APP_API_BASE=https://api.example.com
REACT_APP_FEATURE_FLAGS=betaBanner,newNav
REACT_APP_EXPERIMENTS_ENABLED=true
REACT_APP_LOG_LEVEL=info

## Customizing Content

Projects:
- Edit src/data/projects.json to update your portfolio items. Each entry supports:
  - title (string, required)
  - description (string, required)
  - tags (string[], optional)
  - links (object with optional demo and repo fields)
  - image (string URL, optional)
- The Projects component loads this JSON dynamically and handles missing optional fields gracefully. If the array is empty, a friendly placeholder message is shown.

Sections and text:
- Hero: src/components/Hero.js (update name, subtitle, button labels)
- Skills: src/components/Skills.js (update skill groups and items)
- Experience: src/components/Experience.js (update roles array)
- Contact: src/components/Contact.js (see “Contact form behavior”)
- Shared Section wrapper: src/components/Section.js
- Footer: in src/App.js

Navigation labels and order:
- src/components/NavBar.js controls the nav links and their order.

## Theming and Style Guide

CSS variables define the design system and support light/dark themes:
- Variables are declared in src/App.css under :root (light theme) and [data-theme="dark"] (dark overrides).
- Notable tokens: primary, secondary, success, error, text; surfaces; spacing scale; radii; shadows; gradients.

Theme tokens in JS:
- src/theme.js exports getDesignTokens() and getCssVarNames() for programmatic access when needed (e.g., inline style calculations). Prefer CSS variables in components.

Theme toggle:
- The theme button is in NavBar and uses the useTheme hook (src/hooks/useTheme.js).
- Theme is persisted in localStorage ("theme") and applied to document.documentElement via the data-theme attribute.
- Default theme is "light", with a prefers‑color‑scheme dark fallback on first load if no preference stored.

## Accessibility Features

- Skip to content link for keyboard users.
- Role and aria-* labels for navigation and sections:
  - Nav: role="navigation", aria-label="Primary"
  - Sections: role="region" with aria-labelledby and aria-describedby via Section wrapper
- Focus management on smooth scrolling:
  - useSmoothScroll focuses the target section without extra page jumps.
- Focus-visible outlines for interactive elements and sections.
- Contact form uses appropriate labels, aria-invalid on fields, and live regions:
  - role="status" for non‑urgent updates
  - role="alert" for validation and submission errors

## Testing

Run tests:
- npm test

What tests cover:
- src/__tests__/navigation.test.js
  - Renders nav links, sections, and verifies focus behavior for anchors
- src/__tests__/theme.test.js
  - Toggles between light/dark, asserts persistence in localStorage and data-theme updates
- src/__tests__/contact.test.js
  - Validates required fields and formats
  - Mocks fetch for success/failure when REACT_APP_API_BASE is set
  - Verifies fallback status messaging when no API is configured

Mocking fetch and env:
- Tests set process.env.REACT_APP_API_BASE in each case to exercise API vs. fallback logic.
- For API path, tests inject global.fetch mock implementations and assert request details and UI updates.

## Deployment Notes

- Build with npm run build and deploy the build/ folder to your static hosting provider (e.g., Netlify, Vercel, GitHub Pages, S3 + CloudFront).
- If you need the Contact form to POST to an API, ensure REACT_APP_API_BASE is set at build time to your backend origin. Example:
  - https://api.example.com
  - The Contact form will POST to ${REACT_APP_API_BASE}/contact with a JSON body: { name, email, message }
- For WebSocket‑based features if added later, provide REACT_APP_WS_URL, or ensure REACT_APP_API_BASE is a proper https/http URL so ws/wss can be derived accurately.

## Optional Enhancements and Feature Flags

Feature flags (REACT_APP_FEATURE_FLAGS) and experiments (REACT_APP_EXPERIMENTS_ENABLED) are parsed in src/config/env.js:
- Comma‑separated list or JSON array is supported for REACT_APP_FEATURE_FLAGS.
- Utility helpers:
  - import { hasFeature, isExperimentEnabled } from "./config/env";
  - if (hasFeature("betaBanner")) { /* show preview UI */ }
  - if (isExperimentEnabled()) { /* enable experiments */ }

These flags are not required for the current app to function but provide a consistent pattern for enabling future optional UI or experiments.

## Contact Form Behavior

The Contact component (src/components/Contact.js) validates input and chooses one of two behaviors:

1) With API configured (REACT_APP_API_BASE set)
- On submit, sends a POST request to `${apiBase}/contact` with headers:
  - Content-Type: application/json
- Body includes: { name, email, message }
- On success, the UI shows a success status message and clears inputs.
- On server error (non‑2xx), the UI shows a friendly error via role="alert" without exposing server details.

2) Without API configured (REACT_APP_API_BASE not set)
- The form displays a friendly message in a role="status" live region indicating no contact API is configured.
- An “Email Instead” button is shown with a pre‑filled mailto link. The message includes the provided name, email, and message so users can easily send via their client.
- The code does not auto‑navigate to mailto; it lets the user choose the email option.

Security and privacy:
- The logger utility scrubs sensitive keys and never logs PII values.
- The Contact component never logs the plaintext message payload.

## Development Tips

- Logging: src/utils/logger.js respects REACT_APP_LOG_LEVEL. Levels: error, warn, info, debug.
- Smooth scrolling: src/hooks/useSmoothScroll.js also updates focus for accessibility and URL hash via history.replaceState.
- Scroll spy: src/hooks/useScrollSpy.js uses IntersectionObserver to update active nav link state.

## Troubleshooting

- Missing env variables
  - The app works without optional variables, but Contact API submission requires REACT_APP_API_BASE (or REACT_APP_BACKEND_URL).
- Tests failing due to fetch
  - Ensure tests mock global.fetch when exercising the API path. See src/__tests__/contact.test.js for examples.
- Styling differences in dark mode
  - Confirm data-theme attribute is toggling and that CSS variables are defined for [data-theme="dark"] in src/App.css.

## License

This project template is provided as-is for personal portfolio use. Replace sample content with your own before deploying.
