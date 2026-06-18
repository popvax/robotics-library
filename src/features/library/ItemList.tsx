import type { Item } from '@/lib/schema';
import { ItemRow } from './ItemRow';

export function ItemList({
  items,
  query,
  stars,
  onToggleStar,
  activeTags,
  onToggleTag,
  emptyHint,
}: {
  items: Item[];
  query: string;
  stars: Set<string>;
  onToggleStar: (id: string) => void;
  activeTags: string[];
  onToggleTag: (t: string) => void;
  emptyHint: string;
}) {
  if (!items.length) {
    return <p className="py-24 text-center text-sm text-muted-foreground">{emptyHint}</p>;
  }

  return (
    // First row drops its top padding so the controls row above sits with symmetric spacing.
    <div className="[&>*:first-child]:pt-0">
      {items.map((it) => (
        <ItemRow
          key={it.id}
          item={it}
          query={query}
          starred={stars.has(it.id)}
          onToggleStar={onToggleStar}
          activeTags={activeTags}
          onToggleTag={onToggleTag}
        />
      ))}
    </div>
  );
}
