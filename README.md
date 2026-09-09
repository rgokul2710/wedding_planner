# Our Wedding Planner

A private, mobile-first wedding planning app — tasks, guests, budget, vendors, timeline, documents, and inspiration in one place. Built with React + TypeScript + Vite + Tailwind CSS, hosted for free on GitHub Pages, backed by Supabase (Auth, Postgres, Storage, Realtime).

## Tech stack

- **React 19 + TypeScript + Vite** — app shell and build tooling
- **Tailwind CSS v4** — styling, with a custom warm rose/gold/cream design system (light + dark mode)
- **Radix UI primitives + class-variance-authority** — accessible headless components (dialog, dropdown, tabs, avatar, tooltip) styled to a custom look, not a generic component-library look
- **React Router** — client-side routing
- **lucide-react** — icons
- **sonner** — toast notifications
- **Supabase** — auth, database, storage, realtime
- **react-hook-form + zod** — form state and validation
- **@tanstack/react-query** — server-state caching and mutations
- **Recharts** — budget/report charts (lazy-loaded — its bundle cost only applies to the pages that use it)

## Getting started

### 1. Create a Supabase project (free tier)

1. Go to [supabase.com](https://supabase.com) and create a free account/project.
2. In the project, open **SQL Editor** and run the contents of [supabase/migrations/0001_profiles.sql](supabase/migrations/0001_profiles.sql) (and any later migration files, in order, as they're added).
3. Go to **Project Settings → API** and copy the **Project URL** and **anon public** key.
4. In **Authentication → URL Configuration**, add your dev and production URLs (e.g. `http://localhost:5173/wedding_planner/` and `https://<github-username>.github.io/wedding_planner/`) as **Redirect URLs** — this is required for the password-reset email link to work.

### 2. Run the app

```bash
npm install
cp .env.example .env   # paste in the Project URL and anon key from step 1
npm run dev
```

If `.env` is missing or incomplete, the app shows a friendly "Supabase isn't configured yet" screen instead of crashing.

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
  hooks/        shared React hooks (theme, auth session)
  lib/          framework-agnostic helpers (cn, nav config, Supabase client)
  services/     data-access functions per module (added as each module is built)
  types/        shared TypeScript types (database.ts grows as each module is built)
  features/     module-specific non-UI logic (added as each module is built)
supabase/
  migrations/   SQL migration files, applied in order via the Supabase SQL editor
  seed.sql      local seed data (empty until a later phase needs it)
.github/workflows/deploy.yml   GitHub Pages deploy workflow
```

## Deployment (GitHub Pages)

The app deploys automatically to GitHub Pages on every push to `main` via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

**One-time manual setup required in the GitHub repo:**

1. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Go to **Settings → Secrets and variables → Actions** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   Without these, the deployed site will show the "Supabase isn't configured yet" screen.
3. After the first successful workflow run, the app will be live at `https://<github-username>.github.io/wedding_planner/`.

Routing note: this app uses `BrowserRouter` with a `dist/404.html` copy of `index.html` (created automatically by `npm run build`) so that deep links (e.g. reloading `/tasks` directly) work correctly on GitHub Pages, which has no server-side rewrites.

## Development roadmap

This project is being built incrementally. Each phase ships a working, typechecked, building app before moving to the next.

- [x] **Phase 1** — Project setup, routing, UI foundation, design system, light/dark mode, GitHub Pages deployment pipeline
- [x] **Phase 2** — Supabase setup + authentication (sign up, log in, log out, password reset, protected routes)
- [x] **Phase 3** — Wedding setup + dashboard
- [x] **Phase 4** — Tasks
- [x] **Phase 5** — Guests
- [x] **Phase 6** — Budget + payments
- [x] **Phase 7** — Vendors
- [x] **Phase 8** — Events / timeline
- [x] **Phase 9** — Documents / storage (and Inspiration, which the spec's phase list didn't assign its own slot)
- [x] **Phase 10** — Family / member permissions
- [x] **Phase 11** — Reports
- [x] **Phase 12** — Polish, testing, final deployment

### What Phase 12 covered

- A top-level error boundary — an unexpected render error now shows a friendly "Something went wrong" screen with a reload button instead of a blank page. Verified by deliberately throwing inside a page, confirming the fallback renders, then reverting.
- Every page except Dashboard/Tasks/Guests (the primary bottom-nav tabs) is now lazy-loaded, cutting the initial JS payload from ~252KB to ~115KB gzipped.
- A real accessibility fix: the success/warning/danger badge and form-error-banner colors used to fail WCAG contrast against their own light tint backgrounds (as low as ~2.5:1 in dark mode) because those three status hues only had one shade defined, unlike the rose/gold accents which already had a proper light/dark text pair. Added dedicated darker/lighter text steps and fixed both the `Badge` component and every form's error banner (extracted into one shared `FormError` component along the way, replacing 14 duplicated copies of the same markup).

## Going live — final checklist

All 12 phases are implemented and every migration through `0009` exists. Before using this for real:

1. Run every migration in `supabase/migrations/` in order (SQL Editor), if you haven't already.
2. Fill in `.env` locally (see Getting Started above) and confirm `npm run dev` actually works end to end: sign up, complete onboarding, and try each module once.
3. Set the two `VITE_SUPABASE_*` repo secrets (see Deployment above) and confirm **Settings → Pages → Source** is set to **GitHub Actions**.
4. Push to `main` and check the **Actions** tab for a green run.
5. Visit `https://<your-github-username>.github.io/wedding_planner/`, sign up with your real email, and invite your partner/family from the Family page.
