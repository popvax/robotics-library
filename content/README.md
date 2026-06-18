# Adding entries

Each entry is **one JSON file** in this folder: `content/<id>.json`.

The **filename is the id** — it must be unique and kebab-case (`a–z`, `0–9`, `-`),
e.g. `openvla.json`, `mobile-aloha.json`. Don't put an `id` field inside the file.

## The core rule: extract, never invent

The `title` and `summary` must come from the **actual source** — the paper's arXiv
abstract, the project page, or the repo README. **Never write the summary from your own
knowledge, and never from the tweet's hype.** Open the source and use its own words
(lightly condensed). Only if *no* source is reachable may you write a 1–2 sentence
factual description yourself — and then you must add the `needs-review` tag.

## Workflow for an agent

**When the user drops a paper / project / repo link:**

1. **Open it.** Use the arXiv (or project-page) abstract for `summary` and the real
   paper title for `title`. Don't guess from the URL.
2. **Collect every relevant link** into `links` (project page, arXiv/PDF, code, video,
   dataset, blog…). Put the best primary link **first** — the title links to it.
3. **Tag** with 3–7 tags from the vocabulary below.
4. Save as `content/<id>.json` and run `pnpm validate`.

**When the user drops a tweet / thread link (the common case):**

1. **Fetch the WHOLE thread**, not just the first tweet — e.g. `bird thread <url>` (or
   twitterapi.io `thread_context`). The paper / arXiv / code links are almost always
   **down in the replies**, never in the top tweet.
2. **Gather every link from every tweet** in the thread, and **resolve `t.co`
   redirects** to their final URLs (follow the redirect to where it actually points).
3. **Open those links and work from them** — find the arXiv / project page and pull the
   real title + abstract from there. The tweet text is a pointer, not the source.
4. Build the entry from the source (as above). Keep the thread as a
   `{ "label": "Thread", "url": "…" }` link, but the `summary` is the paper's, not the
   thread's.
5. If the thread has **no resolvable paper/project link** (it's just commentary), skip
   it — or, if it's worth keeping, add a best-effort entry summarised from the thread
   **with the `needs-review` tag** so it's easy to find and fix later.

> Appending to an existing entry: if a dropped link/tweet belongs to an item that's
> already in the library, just add it to that file's `links` array — don't make a duplicate.

## Schema

| field      | required | notes                                                                 |
| ---------- | -------- | --------------------------------------------------------------------- |
| `title`    | ✅       | The real title of the work.                                           |
| `type`     | ✅       | One of: `paper` `website` `repo` `blog` `dataset` `video` `tweet` `course` `hardware` `other`. A paper's project page → `paper`; a GitHub repo → `repo`; a docs/blog post → `blog`. |
| `summary`  | ✅       | Abstract-style, 2–4 sentences.                                        |
| `links`    | ✅\*     | Array of `{ "label", "url" }`. First link is the primary (title link). |
| `tags`     | ☐        | Array of kebab-case strings. Defaults to `[]`.                        |
| `authors`  | ☐        | Array of `"First Last"`. Defaults to `[]`.                            |
| `date`     | ☐        | `"YYYY"`, `"YYYY-MM"`, or `"YYYY-MM-DD"`.                              |
| `venue`    | ☐        | e.g. `"arXiv 2026"`, `"CoRL 2024"`, `"NVIDIA blog"`.                  |
| `featured` | ☐        | `true` to pin it to the top with a star.                              |
| `image`    | ☐        | Optional thumbnail URL (not shown yet).                               |

\* Technically optional in the schema, but every entry should have at least one link.

## Link labels

Use clear, consistent labels (they pick the button icon):
`Project Page` · `Paper` · `arXiv` · `Code` · `Video` · `Dataset` · `Blog` · `Demo`.

## Tags — keep them few and meaningful

Tags are research **themes**, not trivia. Use **2–4 per entry**, only from the list
below — a tag should be a useful way to *browse*.

- ✅ paradigms & problems: `vla`, `world-model`, `imitation-learning`, `sim-to-real`
- ❌ no orgs/labs (`nvidia`, `google-deepmind`), no architectures (`transformer`), no
  venues, no catch-alls (`open-source`, `real-world`) — they don't help browsing.

If something doesn't fit, leave it off rather than invent a tag. Add a new tag only if
several entries would share it.

**The vocabulary:**

`vla` · `world-model` · `video-prediction` · `imitation-learning` ·
`reinforcement-learning` · `sim-to-real` · `manipulation` · `dexterous-manipulation` ·
`human-video` · `generalist-policy` · `reward-design` · `planning` · `diffusion` ·
`flow-matching` · `jepa` · `dataset` · `benchmark`

## Example — `content/openvla.json`

```json
{
  "title": "OpenVLA: An Open-Source Vision-Language-Action Model",
  "type": "paper",
  "summary": "OpenVLA is a 7B open-source vision-language-action model trained on 970k real-world robot demonstrations. It outperforms larger closed models on generalist manipulation while being efficient to fine-tune on consumer GPUs via LoRA.",
  "authors": ["Moo Jin Kim", "Karl Pertsch", "Siddharth Karamcheti"],
  "date": "2024-06-13",
  "venue": "CoRL 2024",
  "tags": ["vla", "generalist-policy", "manipulation", "imitation-learning"],
  "links": [
    { "label": "Project Page", "url": "https://openvla.github.io" },
    { "label": "arXiv", "url": "https://arxiv.org/abs/2406.09246" },
    { "label": "Code", "url": "https://github.com/openvla/openvla" }
  ]
}
```
