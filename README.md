# PopVax Robotics Library

A blazing-fast, fully client-side, fuzzy-searchable library of robotics research —
papers, repos, datasets, blogs and more. No backend: every entry is bundled at build
time, so the whole library is in memory the instant the page loads.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (new-york, neutral, sharp corners) + **lucide** icons
- **Fuse.js** for fuzzy search · **next-themes** for dark mode · **zod** for content validation
- Design language mirrors the `bi-openarm` console (square corners, neutral oklch palette).

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:51737
pnpm validate     # check every content/*.json against the schema
pnpm build        # typecheck + production build to dist/
```

> First install only: pnpm withholds esbuild's build script by default; this repo
> already allow-lists it via `pnpm.onlyBuiltDependencies`, so `pnpm install` runs it.

## Adding entries

The library is just a folder of JSON files in [`content/`](./content). One file per
entry, filename = id. Drop a link to an agent and have it follow
[`content/README.md`](./content/README.md) — it extracts the title, writes an
abstract-style description, collects the links, and tags the entry. Then:

```bash
pnpm validate
```

## How it works

```
content/<id>.json        ← the data (the only thing you edit to curate)
src/lib/schema.ts         ← zod schema + Item type
src/lib/items.ts          ← import.meta.glob(content) → validated, sorted array
src/lib/search.ts         ← Fuse.js index (title > tags > summary > authors)
src/features/library/     ← SearchBar · TypeFilter · TagFilter · ItemList · ItemRow
```

- **Search:** in-memory fuzzy match, weighted by field. Press `/` to focus.
- **Filters:** click a type or a `#tag` to narrow (tags combine with AND).
- **Sort:** featured first, then newest.

## Deploy

It's a static site — `pnpm build` emits `dist/`, deployable to any static host
(GitHub Pages, Vercel, Netlify, Cloudflare Pages). For a GitHub Pages project site,
set `base: '/<repo>/'` in `vite.config.ts`.
