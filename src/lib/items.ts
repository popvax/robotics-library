import { ItemSchema, type Item } from '@/lib/schema';

// Bundle every entry at build time — no runtime fetch, so the whole library is
// in memory the instant the page loads.
const modules = import.meta.glob<{ default: unknown }>('/content/*.json', { eager: true });

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.json$/, '');
}

function loadItems(): Item[] {
  const loaded: Item[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const parsed = ItemSchema.safeParse(mod.default);
    if (!parsed.success) {
      console.error(`[library] skipping invalid entry content/${slug}.json:`, parsed.error.format());
      continue;
    }
    loaded.push({ ...parsed.data, id: parsed.data.id ?? slug });
  }
  // Newest first (by date when present), then alphabetical.
  loaded.sort(
    (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title),
  );
  return loaded;
}

export const items: Item[] = loadItems();

export const allTags: { tag: string; count: number }[] = (() => {
  const counts = new Map<string, number>();
  for (const it of items) for (const t of it.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
})();
