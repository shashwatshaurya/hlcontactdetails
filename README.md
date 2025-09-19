# HL Contact Details

Vite + Vue 3 minimal project.

Run locally:

```bash
npm install
npm run dev
```

The dev server runs on port 3000 by default.

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

