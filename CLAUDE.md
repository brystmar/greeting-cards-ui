# CLAUDE.md — greeting-cards-ui

## Project Overview

React front end for the Greeting Cards app — a tool for managing household contact info and mailing lists. Communicates with a separate Python REST API backend backed by Postgres.

> "Insanity is defined as manipulating complex data via the terminal."

- **Branch:** `main`
- **Deployment:** Docker container managed by Portainer on Intel NUC 13i5 (local)

## Tech Stack

- **Framework:** React 19
- **Build tool:** Vite 7 (migrated from CRA — see migration notes below)
- **Routing:** React Router v7
- **Search:** Fuse.js (fuzzy search)
- **Styling:** CSS / SASS
- **Testing:** vitest + @testing-library/react + @testing-library/jest-dom
- **Package manager:** npm
- **Runtime:** node:20-slim (Docker)
- **Database (backend):** Postgres 15 (`cards` prod, `cards-dev` dev)

## Local Development

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build → /dist
npm run preview      # Preview production build at http://localhost:3000
npm test             # Run vitest test suite
```

## Project Structure

```
index.html             # Vite entry point (no %PUBLIC_URL%)
vite.config.js         # Vite configuration
vite-env.d.ts          # Vite type declarations
Dockerfile             # node:20-slim, npm ci, vite build, expose 4173
CONTEXT.md             # Architecture reference — read before making changes
public/                # Static assets
src/
  components/          # Reusable UI components (.jsx)
  context/             # React context providers (AppDataProvider, etc.)
  data/                # Static/seed data
  hooks/               # Custom React hooks (e.g. useHouseholdSelection.js)
  pages/               # Page-level components
  services/            # API calls, data normalization, business logic
  styles/              # CSS/SASS stylesheets
  App.jsx              # Root component
  router.jsx           # React Router v7 route definitions
  main.jsx             # Vite entry point
  normalize.css        # CSS reset/defaults
```

## Architecture

### Global Data Layer

`AppDataProvider` (in `src/context/`) wraps the entire app and exposes via context:
- `householdData` — all household records
- `addressData` — all address records
- `selectedHH` — currently selected household
- `hhIndex` — Fuse.js search index over households
- `nextIds` — pre-fetched ID values for new records
- `loading` / `error` — async state
- `refresh()` — re-fetches all data from the backend

### Household Feature

- **Container:** `HouseholdContainer.jsx` — orchestration layer only; no direct business logic
- **Hook:** `useHouseholdSelection.js` — manages selection state, search UX, picklist rendering
- **Sub-components:** `HHInfo` (household form), `AddressArray` → `AddressFields` (controlled address forms)

Rule: `value={field ?? ""}` on all controlled inputs — never allow null values in form fields.

### Search

- Fuse.js fuzzy search with keyboard navigation
- Auto-selects when only 1 result remains
- Search side effects live in `useEffect` — never triggered during render to avoid infinite loops

### Services Layer

API calls and data normalization (string/bool coercion) belong in `src/services/`, not in components or hooks.

## Environment Variables

This project uses **Vite** environment variables — not CRA's `process.env.REACT_APP_*`.

```js
// Correct
import.meta.env.VITE_BACKEND_URL

// Wrong — will not work
process.env.REACT_APP_BACKEND_URL
```

Define in `.env.local` (dev) or inject at container build time for production.

## Docker / Deployment

```dockerfile
FROM node:20-slim
WORKDIR /greeting-cards-ui
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
```

- Production container serves the Vite preview server on port **4173**
- Images are version-tagged and pushed to Docker Hub before Portainer re-deploys
- A custom bash deploy script handles the build → tag → push → redeploy workflow

### Database

```bash
# Refresh dev DB from prod
pg_dump cards | psql cards-dev
```

## Code Style

### JavaScript / React

- **No semicolons** unless functionally required
- **Double quotes** for strings
- **Functional components** with hooks — no class-based components
- **Hooks-first architecture** — extract logic into custom hooks, keep components as thin orchestration layers
- Separate business logic into `src/services/`; components should not make API calls directly
- Clean refactors over quick hacks

### JSX Props (consistent with other brystmar projects)

```jsx
// 2 or fewer short props → inline
<button className="btn" onClick={handleSave} />

// 3+ props → one per line, first prop inline, closing /> on last-prop line
<select className="input picklist"
        name="category"
        value={card.category}
        onChange={handleChange}
        required={true}>
```

### Component / File Naming

- PascalCase, no punctuation
- Verb-first when a verb is present: `BtnAddCard.jsx`, `ConvertText.js`
- All component files use `.jsx` extension
- Group 3+ related components in a subfolder

### SASS

- Indented syntax (no braces, no semicolons)
- Variables at top: Fonts → Color palette → Layout defaults
- Lowercase, hyphen-separated, operative word first (`$color-accent`, not `$accent-color`)

## UX Principles

- Avoid loading flicker — manage async state carefully in `AppDataProvider`
- Controlled inputs only — never uncontrolled
- Minimal rerenders — be deliberate about what triggers state updates

## Vite Migration Notes (from CRA)

- All component files use `.jsx` extension
- `index.html` is at the repo root, not in `public/`; does not use `%PUBLIC_URL%`
- `vite-env.d.ts` added for TypeScript type declarations
- Use `import.meta.env.*` for all environment variables
- Dev script: `npm run dev` (not `npm start`)

## Notes for Claude

- **Read `CONTEXT.md` first** — it has the most current architecture summary
- Do not use `process.env.REACT_APP_*` — always use `import.meta.env.VITE_*`
- Do not use `npm start` — the dev command is `npm run dev`
- Do not introduce `moment`, `axios`, or other heavy dependencies without discussion
- New API/data logic belongs in `src/services/`, not in components
- All side effects that depend on search/selection state belong in `useEffect` hooks
- `AppDataProvider` is the single source of truth — don't duplicate data fetching elsewhere
