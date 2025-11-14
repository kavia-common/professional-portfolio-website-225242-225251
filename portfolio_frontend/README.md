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

### Preview locally (development)
- Install dependencies if not already installed: npm install
- Start the dev server: npm start
- Open http://localhost:3000

Changes hot‑reload automatically. If the port is in use, CRA will prompt to use the next available port.

Environment variables with the REACT_APP_ prefix can be placed in a .env file at the project root. They are read at build time by Create React App (CRA).

### Run tests
- npm test

The test runner (Jest + React Testing Library) runs in watch mode. Press a to run all tests. Press q to quit.

The suite currently covers:
- Navigation and section rendering/focus behavior
- Theme toggle and persistence to localStorage
- Contact form validation and both submission paths (with and without API)

Interpreting results:
- Failures in navigation tests often indicate aria-label changes or heading changes. Update labels consistently in NavBar or Section if you change text.
- Failures in theme tests generally mean the data-theme attribute is not set or localStorage key "theme" is not being updated. Verify useTheme hook usage.
- Failures in contact tests when API flow is expected usually mean process.env.REACT_APP_API_BASE was not set in the test or fetch was not mocked. See src/__tests__/contact.test.js for correct mocking patterns.

See “Testing” below for additional details on mocking fetch and environment.

### Build for production
- npm run build

This generates an optimized production bundle in the build/ folder. Serve the build directory with a static file server or deploy to your hosting provider (Netlify, Vercel, GitHub Pages, S3/CloudFront, etc.).

## Environment Configuration

The app reads configuration from REACT_APP_* variables via src/config/env.js. The getEnv() function normalizes and returns a readonly config object.

Full list and defaults:
- REACT_APP_API_BASE
  - Used as env.apiBase. If present, Contact POSTs to ${apiBase}/contact.
  - Default: "" (empty → Contact falls back to mailto guidance).
- REACT_APP_BACKEND_URL
  - Fallback for apiBase when REACT_APP_API_BASE is not provided.
  - Default: "".
- REACT_APP_FRONTEND_URL
  - Used as env.frontendUrl. If not provided, env.js attempts window.location.origin.
  - Default: window.location.origin (best‑effort).
- REACT_APP_WS_URL
  - Used as env.wsUrl. If not provided, env.js derives ws(s) from apiBase http(s).
  - Default: derived from apiBase or "".
- REACT_APP_NODE_ENV
  - Used as env.nodeEnv. Also gates dev‑only debug logs in env.js and useTheme().
  - Default: process.env.NODE_ENV or "development".
- REACT_APP_ENABLE_SOURCE_MAPS
  - Used as env.enableSourceMaps (boolean).
  - Default: nodeEnv !== "production".
- REACT_APP_FEATURE_FLAGS
  - Used as env.featureFlags (string[]). Accepts JSON array or comma‑separated list.
  - Helpers: hasFeature(flag) checks presence; isExperimentEnabled() is separate (see below).
- REACT_APP_EXPERIMENTS_ENABLED
  - Used as env.experimentsEnabled (boolean).
  - Default: false.
- REACT_APP_LOG_LEVEL
  - Used as env.logLevel for src/utils/logger.js ("error" | "warn" | "info" | "debug").
  - Default: "debug" in development; "info" otherwise.
- REACT_APP_HEALTHCHECK_PATH
  - Used as env.healthcheckPath.
  - Default: "/healthz".
- REACT_APP_PORT
  - Used as env.port (number). Useful for container metadata.
  - Default: 3000.
- REACT_APP_TRUST_PROXY
  - Used as env.trustProxy (boolean).
  - Default: false.

How env/config is read:
- The app imports getEnv() (src/config/env.js), which reads process.env.REACT_APP_* at build time and returns a frozen configuration:
  - { apiBase, frontendUrl, wsUrl, nodeEnv, enableSourceMaps, featureFlags, experimentsEnabled, logLevel, healthcheckPath, port, trustProxy }
- Helpers also exported:
  - hasFeature(flag: string): boolean
  - isExperimentEnabled(): boolean

Example .env (do not commit real secrets to VCS):
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
- Save the file and refresh; the Projects section will update automatically. If the array is empty, a friendly placeholder message is shown.

Sections and text:
- Hero (src/components/Hero.js)
  - Replace “Your Name”, update the subtitle, and adjust CTA targets if you change section ids.
- Skills (src/components/Skills.js)
  - Edit the skills object to reflect your stack and tools.
- Experience (src/components/Experience.js)
  - Update the roles array with your company, role, period, and summary.
- Contact (src/components/Contact.js)
  - Replace the placeholder publicEmail value before deploying if you rely on mailto fallback.
  - If you have a backend, set REACT_APP_API_BASE and ensure your API implements POST /contact.
- Shared wrapper (src/components/Section.js)
  - Titles are h2 with aria-labelledby and aria-describedby wiring. Keep this structure for accessibility.
- Footer (in src/App.js)
  - Update the © notice and taglines.

Navigation labels and order:
- src/components/NavBar.js controls the nav items. If you rename section ids, update href targets and scrollToId() calls accordingly.

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

Coverage and scope:
- The suite emphasizes accessibility behavior (roles, labels, focus), theme toggling, and contact submission logic.
- Add new tests under src/__tests__/ to cover additional sections or features you introduce.

Interpreting failures:
- Navigation: Ensure section ids match NavBar links. Headings should remain semantic (Hero h1; other sections h2).
- Theme: Confirm useTheme is applied at App root, and data-theme is set on documentElement.
- Contact: When testing API path, set process.env.REACT_APP_API_BASE and provide a global.fetch mock that resolves to { ok: true, json: async () => ({ ok: true }) } or a non-ok shape for error paths.

Mocking fetch and env:
- Set per-test before render:
  - process.env.REACT_APP_API_BASE = 'https://api.example.com'
  - global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
- For fallback behavior tests, clear REACT_APP_API_BASE and do not define global.fetch to exercise the mailto path.

## Deployment Notes

- Build with npm run build and deploy the build/ folder to your static hosting provider (e.g., Netlify, Vercel, GitHub Pages, S3 + CloudFront, Firebase Hosting).
- Contact API: Set REACT_APP_API_BASE at build time to your backend origin (e.g., https://api.example.com). The Contact form POSTs to ${REACT_APP_API_BASE}/contact with body { name, email, message }.
- If you do not have a backend yet, keep REACT_APP_API_BASE unset and update the mailto placeholder in Contact.js to your public email.
- WebSockets (optional): Provide REACT_APP_WS_URL explicitly, or use an http(s) apiBase that can be derived to ws(s) by env.js.

## Optional Enhancements and Feature Flags

Feature flags (REACT_APP_FEATURE_FLAGS) and experiments (REACT_APP_EXPERIMENTS_ENABLED) are parsed in src/config/env.js:
- Comma‑separated list or JSON array is supported for REACT_APP_FEATURE_FLAGS.
- Utility helpers:
  - import { hasFeature, isExperimentEnabled } from "./config/env";
  - if (hasFeature("betaBanner")) { /* show preview UI */ }
  - if (isExperimentEnabled()) { /* enable experiments */ }

Ideas you can gate behind flags:
- "betaBanner": Display a non‑intrusive banner announcing upcoming features.
- "altTheme": Try alternative accent colors using CSS var overrides in a small scoped wrapper.
- "newNav": Prototype a responsive/mobile nav variant.

These flags are optional and purely opt‑in. They help you iterate without disrupting the stable experience.

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
- Important: Update the publicEmail placeholder in Contact.js to your real public email before deploying.

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
