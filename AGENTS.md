# AGENTS.md

Guide for AI agents working in this repo — the **PopVax Robotics Library**, a fast,
fully client-side, fuzzy-searchable catalog of robotics research. The data is just a
folder of JSON files (`content/*.json`) bundled into the app at build time.

## Commands

- `pnpm dev` — local dev server (http://localhost:51737). **Don't start it unless asked**; the user usually has one running.
- `pnpm validate` — check every `content/*.json` against the schema. **Run this after editing content.**
- `pnpm build` — typecheck + production build.

Use **pnpm** (not npm/yarn).

## Never commit without asking

Do not `git commit`, `git push`, or create/modify remotes without explicit user
approval — every time. Make the edits, run `pnpm validate`, show the result, and wait.

---

# The main task: adding library entries

Each entry is **one JSON file**: `content/<id>.json`. The **filename is the id** —
unique, kebab-case (`a–z`, `0–9`, `-`), e.g. `openvla.json`. Don't put an `id` field inside.

## The core rule: extract, never invent

`title` and `summary` must come from the **actual source** — the paper's arXiv abstract,
the project page, or the repo README. **Never write the summary from your own knowledge
or from a tweet's hype.** Open the source and use its own words (lightly condensed). Only
if *no* source is reachable may you write a 1–2 sentence factual note — and then add the
`needs-review` tag.

## Title — lead with the project name

Prepend the project/model/method codename to the `title` so it's always visible when
browsing, e.g. `"EgoMAN: Flowing from Reasoning to Motion: …"`. **Only prepend when the
`summary` actually names that codename** — otherwise keep the verbatim source title (don't
invent a name). Match the codename's exact casing (`DeMiAn`, `InDex`, `DeltaTok` — not
`DeMIAn`/`Index`/`Deltatok`) and keep the rest of the title verbatim. Prepending is fine even
when the title already spells the name out: `"Volt: Volume Transformer: …"`, `"RQL: Reversal Q-Learning"`.

## Workflow

**A paper / project / repo / website link:**
1. Open it. Use the arXiv (or project-page) abstract for `summary`, the real title for `title`.
2. Collect every relevant link into `links` (project page, arXiv/PDF, code, video, dataset, blog). Best/primary link first — the title links to it.
3. Tag with 2–4 tags from the vocabulary below.
4. Save `content/<id>.json` and run `pnpm validate`.

**A tweet / thread link** (the common case):
1. **Fetch the WHOLE thread** — `bird thread <url>` (or twitterapi.io `thread_context`). The paper/arXiv/code links are almost always **down in the replies**, not the top tweet.
2. Gather every link from every tweet and **resolve `t.co` redirects** to their real destinations.
3. Open those links and work from them — find the arXiv/project page and pull the real title + abstract. The tweet is a pointer, not the source.
4. Build the entry from the source; keep the thread as a `{ "label": "Thread", "url": "…" }` link, but the `summary` is the paper's.
5. No resolvable paper/project link → skip it, or keep a best-effort entry tagged `needs-review`.

**Already in the library?** Match on arXiv id / repo / project domain / title. If it exists,
append the new link(s) to that file's `links` — don't duplicate.

## Schema

| field      | required | notes |
| ---------- | -------- | ----- |
| `title`    | ✅ | The real title of the work. |
| `summary`  | ✅ | Abstract-style, 2–4 sentences, extracted from the source. |
| `links`    | ✅* | Array of `{ "label", "url" }`. First is primary (the title link). |
| `tags`     | ☐ | kebab-case strings (see below). |
| `authors`  | ☐ | `["First Last", …]` — the **full** list, in source order. |
| `date`     | ☐ | `"YYYY"`, `"YYYY-MM"`, or `"YYYY-MM-DD"` (drives sort order). |
| `starred`  | ☐ | `true` to flag an editorial highlight — renders a purple star before the title. |

\* Technically optional, but every entry should have at least one link.

**Link labels** (they pick the icon): `Project Page` · `Paper` · `arXiv` · `Code` ·
`Video` · `Dataset` · `Models` · `Blog` · `Thread`.

## Tags — few and meaningful

2–4 per entry. They're research **themes** — a useful way to browse. **Reuse tags already
in the library; don't invent.** No org/lab names (`nvidia`), no architectures
(`transformer`), no venues.

Working vocabulary: `vla` · `world-model` · `video-prediction` · `representation` ·
`imitation-learning` · `reinforcement-learning` · `test-time-compute` · `diffusion` ·
`flow-matching` · `manipulation` · `dexterous-manipulation` · `grasping` · `humanoid` ·
`human-video` · `egocentric` · `generalist-policy` · `planning` · `reward-design` ·
`perception` · `sim-to-real` · `dataset` · `benchmark` · `needs-review` (flag).

## Example — `content/openvla.json`

```json
{
  "title": "OpenVLA: An Open-Source Vision-Language-Action Model",
  "summary": "OpenVLA is a 7B open-source vision-language-action model trained on 970k real-world robot demonstrations. It outperforms larger closed models on generalist manipulation while being efficient to fine-tune on consumer GPUs via LoRA.",
  "authors": ["Moo Jin Kim", "Karl Pertsch", "Siddharth Karamcheti"],
  "date": "2024-06-13",
  "tags": ["vla", "generalist-policy", "manipulation", "imitation-learning"],
  "links": [
    { "label": "Project Page", "url": "https://openvla.github.io" },
    { "label": "arXiv", "url": "https://arxiv.org/abs/2406.09246" },
    { "label": "Code", "url": "https://github.com/openvla/openvla" }
  ]
}
```

## Project layout

- `content/<id>.json` — the data (the only thing you edit to curate)
- `src/lib/` — `schema.ts` (zod), `items.ts` (loads + sorts), `search.ts` (Fuse.js), `itemMeta.ts`, `useStars.ts`, `clipboard.ts`, `utils.ts`
- `src/features/library/` — UI: `Library`, `ItemRow`, `ItemList`, `TagPicker`
- `src/App.tsx`, `src/main.tsx`, `src/index.css` — app shell
- `scripts/validate.ts` — the validator (`pnpm validate`)
