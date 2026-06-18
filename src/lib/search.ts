import Fuse from 'fuse.js';
import type { Item } from '@/lib/schema';

/** Build an in-memory fuzzy index. Cheap enough to rebuild, but build once and reuse. */
export function createFuse(items: Item[]): Fuse<Item> {
  return new Fuse(items, {
    includeScore: true,
    ignoreLocation: true, // match anywhere in the field, not just the start
    threshold: 0.3, // stricter — avoids loose fuzzy hits in long summaries
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'tags', weight: 0.3 },
      { name: 'summary', weight: 0.18 },
      { name: 'authors', weight: 0.1 },
      { name: 'venue', weight: 0.06 },
      { name: 'type', weight: 0.05 },
    ],
  });
}

export function fuzzySearch(fuse: Fuse<Item>, query: string): Item[] {
  const q = query.trim();
  if (!q) return [];
  return fuse.search(q).map((r) => r.item);
}
