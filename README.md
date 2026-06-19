# PopVax Robotics Library

A fast, fully client-side, fuzzy-searchable library of robotics research — papers, repos,
datasets, blogs and more. No backend: every entry is bundled at build time, so the whole
library is in memory the instant the page loads.

**Live:** https://popvax.github.io/robotics-library/

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** (sharp, neutral, Satoshi) · **Fuse.js** fuzzy search · **motion** animations
- **zod**-validated content · **radix-ui** for the tag dropdown

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:51737
pnpm validate     # check every content/*.json against the schema
pnpm build        # typecheck + production build to dist/
```

## Adding entries

The library is just a folder of JSON files in [`content/`](./content) — one file per
entry, filename = id. Drop a link (paper, repo, site, or a tweet/thread) to an agent and
have it follow **[`AGENTS.md`](./AGENTS.md)**, which defines the schema, the
extract‑never‑invent rule, the tweet‑thread flow, and the tag set. Then `pnpm validate`.

## How it works

```
content/<id>.json          ← the data (curate this)
src/lib/schema.ts           ← zod schema + Item type
src/lib/items.ts            ← import.meta.glob(content) → validated, sorted array
src/lib/search.ts           ← Fuse.js index (title > tags > summary > authors)
src/features/library/       ← Library · ItemRow · ItemList · TagPicker
scripts/validate.ts         ← pnpm validate
```

- **Search:** in-memory fuzzy match, weighted by field (press `/` or the search icon).
- **Filters:** tag dropdown (OR) + a `★` bookmarks filter (stored in `localStorage`).
- **Sharable:** search + filters live in the URL query string.

## Deploy

GitHub Pages via Actions (`.github/workflows/deploy.yml`): every push to `main` builds
with pnpm and publishes `dist/`. The project is served under `/robotics-library/`, so
`vite.config.ts` sets `base` to that for production builds (dev stays at `/`).
