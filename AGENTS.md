# Agent instructions

This file gives AI coding assistants (Claude Code, Cursor, Antigravity, Aider, Gemini CLI, Copilot, etc.) the context they need to work safely in this repo. Read it first.

## Project

`amlvera-frontend` — a modern **analytics / admin dashboard**: a React SPA that consumes a REST API. Data-dense screens (KPIs, tables, CRUD, auth) built on a tokenized design system. Structure is feature-based and domain-agnostic — each business area owns its own folder.

> **Language: JavaScript (JSX).** There is no `typescript` package installed and `build` is plain `vite build`. `@types/react` / `@types/react-dom` are present only for editor IntelliSense in JSX. Runtime shape/validation safety comes from **Zod schemas**, not compile-time types. If you intend to adopt TypeScript, treat it as an approval-gated change (add `typescript`, update the build step and config, rename files).

## Tech stack

Pinned to `package.json`:

- React 18 + JSX
- Vite 5 build; ESLint 9 (flat config) for linting. **No test runner configured yet** — no Vitest/Jest/Cypress.
- Tailwind CSS v4 via `@tailwindcss/vite` — utility-first styling, tokens declared in a CSS-first `@theme` block (`src/index.css`)
- React Router v7 (`react-router-dom`) — SPA navigation, nested layouts
- TanStack Query (React Query) v5 — **all** server state (fetching, caching, mutations)
- Zustand v5 — client/UI state only (sidebar, theme, filters, auth session)
- React Hook Form v7 + Zod v4 (`@hookform/resolvers`) — forms and schema validation
- axios — HTTP client, single instance with interceptors (`src/lib/api-client.js`)
- TanStack Table v8 — headless tables (sort/paginate/filter)
- Recharts v3 — charts
- lucide-react — icons (canonical icon library going forward)
- date-fns — dates; `clsx` + `tailwind-merge` via the `cn()` helper

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Brand colors

Two brand colors, each with a distinct role — don't mix them up:

- **Green `#006838`** — the interactive/CTA color. Anchored at `--color-brand-600`. Use for buttons, links, focus rings, and form accents (`bg-brand-600`, `text-brand-600`, `ring-brand-500`, `accent-brand-600`).
- **Navy Blue `#031A37`** — the structural/chrome color. Anchored at `--color-navy-900`. Use for hero/split panels, dark surfaces, and headers (`bg-navy-950`, `from-navy-800 to-navy-950`). Use the light tints (`text-navy-100`/`text-navy-200`) for body text sitting on a navy background.

Both are full 50–900(+950) tints/shades declared in the `@theme` block in `src/index.css`. Don't hard-code either hex value in components — always go through the `brand-*` / `navy-*` tokens.

## READ FIRST — design & architecture

Before creating, redesigning, or wiring any screen, read **[dashboard-architecture.md](./dashboard-architecture.md)** at the project root. It is the single source of truth for:

- The design system — color, typography, spacing tokens (declared in `src/index.css` `@theme`)
- The four-layer component model (Layout → Page → Feature → UI primitive)
- The three-tier API layer (client → service module → query hook)
- The server-state / client-state split
- Reusable patterns (`Button`, `Card`, `StatCard`, `cn()`, loading/error/empty states)

> Note: that doc's code samples are written in TypeScript for clarity. This project is JavaScript — read them as JS with the type annotations dropped. Use **Zod schemas** where the doc uses TS types.

### Canonical patterns — copy these as starters

| Page type | Pattern to follow |
|---|---|
| **List (server-paginated)** — the default | `features/users/` — service → `useUsers()` hook → `UsersTable` |
| **Form (create / edit)** | React Hook Form + Zod inside a `Dialog`, mutation invalidates the list query |
| **Dashboard / overview** | `features/overview/` — `StatCard` grid + Recharts, one hook per section |
| **Detail page** | `features/*/[Entity]DetailPage.jsx` — single-record query + `PageHeader` |

Every data-driven page follows the same shape: **loading → error → empty → data**. Use the shared `<TableSkeleton/>`, `<ErrorState/>`, `<EmptyState/>` rather than reinventing them per feature.

## Code layout

- UI primitives (dumb, reusable) live in `src/components/ui/` (`.jsx`). Use these — don't rebuild buttons/cards/inputs inline.
- App-shell components (`DashboardLayout`, `Sidebar`, `Topbar`, `PageHeader`) live in `src/components/layout/`. Don't add new shell siblings without discussion.
- Each domain lives in `src/features/<domain>/` and owns its `components/`, `hooks/`, `api.js`, and page files. Data shapes are defined as **Zod schemas** (e.g. `schema.js`), not a types file.
- Sidebar nav is driven by the config array in `src/config/nav.js`. Add new entries there rather than editing `Sidebar.jsx` markup.
- The HTTP client and query client live in `src/lib/`. Zustand stores in `src/stores/`. Shared helpers in `src/lib/utils.js`.
- Route tree in `src/app/router.jsx`; providers in `src/app/providers.jsx`.

## Critical rules (do not break)

1. **Server state lives in React Query — never mirror fetched data into Zustand or long-lived `useState`.** React Query is the single source of truth for anything that came from the API.
2. **All API access goes through the three-tier layer:** `api-client.js` → feature `api.js` service → query/mutation hook. Components and pages import hooks only — **never call `axios` or `fetch` directly** in a component.
3. **No hard-coded hex or arbitrary pixel values in components.** Only design tokens from the `@theme` block (e.g. `bg-surface`, `text-brand-500`, `border-border`). Adding a new token means editing `src/index.css`.
4. **UI primitives in `src/components/ui/` stay pure** — no API calls, no routing, no business logic. Props in, markup out.
5. **Keep features isolated.** Domain code stays in its `features/<domain>/` folder. Promote a component to `components/ui/` only when it's used by 2+ features.
6. **Only `lucide-react` icons** for new UI. Don't introduce a second icon library.
7. **Mutations invalidate the queries they affect** (`queryClient.invalidateQueries`). Don't hand-patch cache unless there's a clear reason.
8. **Validate at the boundaries with Zod.** There is no compile-time type checking, so Zod is the guardrail: parse API responses in the service layer and validate form input with the resolver. Don't trust unvalidated shapes.
9. **NEVER touch `.env`** or commit secrets. Only `VITE_`-prefixed vars are exposed to the client; the API base URL comes from `VITE_API_URL`.
10. **Accessibility floor is non-negotiable:** visible keyboard focus (`focus-visible:ring-*`), `aria-label` on icon-only buttons, focus trap + `Esc` on modals, `prefers-reduced-motion` respected.

## Commands requiring human approval

- Any change to `package.json` dependencies (add / remove / version bump)
- Any change to `vite.config.js` or the ESLint flat config (`eslint.config.js`)
- Any change to `.env` or environment typings that affect runtime config
- **Adopting TypeScript** (adds `typescript`, changes the `build` script + config, renames `.jsx`/`.js` files)
- Adding a **test runner** (Vitest, Jest, Cypress) or a new state/routing/data-fetching library
- Adding, removing, or renaming top-level design tokens in `src/index.css`
- Any `git push --force`, `git reset --hard`, branch delete, or destructive cleanup

## Core patterns — how the layers connect

**API layer (the backbone).** Three tiers, top to bottom:

- `src/lib/api-client.js` — the single axios instance. Request interceptor attaches the auth token; response interceptor normalizes errors and handles `401` globally (logout + redirect to `/login`).
- `src/features/<domain>/api.js` — thin service object, one method per endpoint (`list`, `get`, `create`, `update`, `remove`). Parse responses with the feature's Zod schema here so the rest of the app gets validated data.
- `src/features/<domain>/hooks/` — `useQuery` / `useMutation` wrappers. **This is the only thing components import.** Query keys are namespaced per feature.

**State split.**

- Server data (users, metrics, orders) → React Query.
- Global UI (sidebar open, theme, active filters) → Zustand (`src/stores/ui-store.js`).
- Local UI (modal open, hovered row, form draft) → `useState`.
- Auth session (token, current user) → persisted Zustand store + a Query for the profile.

**Styling.** Compose Tailwind classes with the `cn()` helper (`clsx` + `tailwind-merge`) from `src/lib/utils.js` — not string concatenation. Numbers in KPIs/tables use `font-mono tabular-nums` so digits don't jitter on update.

## Where to find context

- `dashboard-architecture.md` — full design system, component model, and API-layer reference (with code)
- `src/config/nav.js` — sidebar navigation source of truth
- `src/lib/api-client.js` — auth + error-handling contract for every request
- Mirror this file as `CLAUDE.md` and `.cursorrules` if your assistant looks for those names.
