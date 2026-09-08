# Our Wedding Planner

A private, mobile-first wedding planning app — tasks, guests, budget, vendors, timeline, documents, and inspiration in one place. Built with React + TypeScript + Vite + Tailwind CSS, hosted for free on GitHub Pages, backed by Supabase (Auth, Postgres, Storage, Realtime).

## Tech stack

- **React 19 + TypeScript + Vite** — app shell and build tooling
- **Tailwind CSS v4** — styling, with a custom warm rose/gold/cream design system (light + dark mode)
- **Radix UI primitives + class-variance-authority** — accessible headless components (dialog, dropdown, tabs, avatar, tooltip) styled to a custom look, not a generic component-library look
- **React Router** — client-side routing
- **lucide-react** — icons
- **sonner** — toast notifications
- **Supabase** — auth, database, storage, realtime (added starting Phase 2)

## Getting started

```bash
npm install
cp .env.example .env   # fill in Supabase values once Phase 2 is set up
npm run dev
```

Other scripts:

```bash
npm run build       # typecheck + production build (also generates dist/404.html for GH Pages SPA routing)
npm run preview      # preview the production build locally
npm run typecheck    # TypeScript check only, no emit
npm run lint         # oxlint
```

## Project structure

```
src/
  components/   reusable UI (components/ui/* are design-system primitives)
  layouts/      route-level layout shells (AppLayout, AuthLayout)
  pages/        one file per route
  hooks/        shared React hooks (e.g. theme)
  lib/          framework-agnostic helpers (cn, nav config, and — from Phase 2 — the Supabase client)
  services/     data-access functions per module (added as each module is built)
  types/        shared TypeScript types (added as each module is built)
  features/     module-specific non-UI logic (added as each module is built)
supabase/
  migrations/   SQL migration files (added in Phase 2)
  seed.sql       local seed data (added in Phase 2)
.github/workflows/deploy.yml   GitHub Pages deploy workflow
```

## Deployment (GitHub Pages)

The app deploys automatically to GitHub Pages on every push to `main` via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

**One-time manual setup required in the GitHub repo:**

1. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Once Phase 2 (Supabase) is wired up, go to **Settings → Secrets and variables → Actions** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   (The build works without these today since no code reads them yet — but the workflow already passes them through so nothing needs to change later.)
3. After the first successful workflow run, the app will be live at `https://<github-username>.github.io/wedding_planner/`.

Routing note: this app uses `BrowserRouter` with a `dist/404.html` copy of `index.html` (created automatically by `npm run build`) so that deep links (e.g. reloading `/tasks` directly) work correctly on GitHub Pages, which has no server-side rewrites.

## Development roadmap

This project is being built incrementally. Each phase ships a working, typechecked, building app before moving to the next.

- [x] **Phase 1** — Project setup, routing, UI foundation, design system, light/dark mode, GitHub Pages deployment pipeline
- [ ] **Phase 2** — Supabase setup + authentication
- [ ] **Phase 3** — Wedding setup + dashboard
- [ ] **Phase 4** — Tasks
- [ ] **Phase 5** — Guests
- [ ] **Phase 6** — Budget + payments
- [ ] **Phase 7** — Vendors
- [ ] **Phase 8** — Events / timeline
- [ ] **Phase 9** — Documents / storage
- [ ] **Phase 10** — Family / member permissions
- [ ] **Phase 11** — Reports
- [ ] **Phase 12** — Polish, testing, final deployment
