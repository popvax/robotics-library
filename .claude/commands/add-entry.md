---
description: Add a library entry from a tweet/thread, paper, repo, or website URL
argument-hint: <url | urls | pasted text>
---

Add one or more entries to this robotics library from:

$ARGUMENTS

Follow **`AGENTS.md`** (repo root) exactly — the schema, the **extract‑never‑invent** rule,
the tweet/thread flow (fetch the whole thread, resolve `t.co`, work from the real
paper/project page), de‑duplication against existing `content/*.json`, the tag set, and
`pnpm validate`.

Show the new/edited file(s) as a preview and **do not commit** — the user reviews and commits.
