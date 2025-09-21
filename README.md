# HL Contact Details

HL Contact Details is a Vue 3 single-page app for browsing contact information, connections, and notes. It renders a dynamic UI from JSON configs, uses Vue Router for navigation and Vuex for state, and provides reusable base components. Built with Vite for fast development and optimized production builds (treeshaking, Terser minification, gzip/brotli compression).

## Run locally:

```bash
npm install
npm run dev
```

The dev server runs on port 3000 by default.

## Linting & formatting

```bash
# Lint
yarn lint

# Lint and auto-fix
yarn lint:fix

# Format with Prettier
yarn format
```

## Production build

```bash
# Build (production)
yarn build

# Preview built app locally (http://localhost:3000)
yarn preview
```

## Analyze bundle sizes

```bash
# Will open in a browser tab automatically
yarn analyze
```

## Folder structure

```text
.
├─ index.html                  Root HTML entry for Vite
├─ src/
│  ├─ main.ts                  App bootstrap; mounts Vue app
│  ├─ App.vue                  Root component
│  ├─ router/                  Vue Router setup and route guards
│  ├─ store/                   Vuex store (modules: contactData, contactFields)
│  ├─ services/                Data access and caching over JSON configs
│  ├─ configs/
│  │  └─ jsonConfigs/          Mock JSON data and layout config
│  ├─ components/              Feature components (contactDetails, connections, notes, sidebar)
│  ├─ base-components/         Reusable UI primitives (Button, Card, Input, etc.)
│  ├─ utils/                   Helpers (localStorage cache, dynamic layout renderer)
│  ├─ styles/                  Global styles
│  └─ views/                   Route-level views (Home.vue)
├─ vite.config.ts              Vite configuration
├─ tsconfig.json               TypeScript configuration
├─ package.json                Scripts and dependencies
└─ README.md                   This file
```

Optimizations:

- Source maps are generated in production.
- Assets are minified with Terser and compressed to .gz and .br.
- Tree-shaking is enabled via Rollup (Vite build).
