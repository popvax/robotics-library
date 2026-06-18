import * as React from 'react';
import { Search, Star, X } from 'lucide-react';

import { allTags, items } from '@/lib/items';
import { createFuse, fuzzySearch } from '@/lib/search';
import { useStars } from '@/lib/useStars';
import { cn } from '@/lib/utils';
import { TagPicker } from './TagPicker';
import { ItemList } from './ItemList';

/** Read the initial search/filter state from the URL query string. */
function readParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get('q') ?? '',
    tags: p.getAll('tag').filter(Boolean),
    starred: p.get('starred') === '1',
  };
}

export function Library() {
  const { stars, toggle: toggleStar } = useStars();

  const [query, setQuery] = React.useState(() => readParams().q);
  const [activeTags, setActiveTags] = React.useState<string[]>(() => readParams().tags);
  const [starredOnly, setStarredOnly] = React.useState(() => readParams().starred);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const fuse = React.useMemo(() => createFuse(items), []);
  const results = React.useMemo(() => {
    const base = query.trim() ? fuzzySearch(fuse, query) : items;
    return base.filter((it) => {
      if (starredOnly && !stars.has(it.id)) return false;
      // OR semantics: keep an item if it carries any of the selected tags.
      if (activeTags.length && !activeTags.some((t) => it.tags.includes(t))) return false;
      return true;
    });
  }, [query, activeTags, starredOnly, stars, fuse]);

  // ⌘K / Ctrl+K focuses the search field.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Reflect search + filters in the URL so any view is shareable / bookmarkable.
  React.useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    for (const t of activeTags) p.append('tag', t);
    if (starredOnly) p.set('starred', '1');
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [query, activeTags, starredOnly]);

  const toggleTag = (tag: string) =>
    setActiveTags((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]));

  const hasFilters = Boolean(query.trim() || activeTags.length || starredOnly);
  const clearAll = () => {
    setQuery('');
    setActiveTags([]);
    setStarredOnly(false);
  };

  const emptyHint = starredOnly
    ? stars.size
      ? 'No bookmarks match these filters.'
      : 'No bookmarks yet — tap the star on any entry to save it.'
    : 'Try a different search or clear the filters.';

  return (
    <>
      {/* Fixed brand line. Full-width sticky element + transform-gpu = no scroll jitter.
          The bar is full-width on mobile, and constrained to the content column on
          desktop (where its border lines up with the rows). */}
      <header className="sticky top-0 z-40 transform-gpu">
        <div className="mx-auto max-w-3xl px-4">
          <div className="-mx-4 flex items-center gap-1.5 border-b border-border bg-background px-4 py-4 sm:mx-0 sm:px-0">
            <img src={`${import.meta.env.BASE_URL}popvax-logo.png`} alt="PopVax" width={24} height={24} className="size-6 shrink-0" />
            <h1 className="truncate text-base font-medium tracking-tight">PopVax Robotics Library</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16">
        {/* Search + filters scroll with the page; symmetric padding, no line beneath. */}
        <div className="flex flex-wrap items-center gap-2 py-6">
          <div className="flex h-10 w-full items-center gap-2 border border-border px-2.5 text-muted-foreground transition-colors focus-within:border-foreground/50 sm:h-8 sm:w-64">
            <Search className="size-4 shrink-0" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur(); // dismiss the mobile keyboard
              }}
              placeholder="Search…  (⌘K)"
              spellCheck={false}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Pill active={starredOnly} onClick={() => setStarredOnly((s) => !s)}>
            <Star className={cn('size-4', starredOnly && 'fill-current')} />
            Starred
            {stars.size > 0 && <span className="font-mono text-xs opacity-70">{stars.size}</span>}
          </Pill>
          <TagPicker
            tags={allTags}
            active={activeTags}
            onToggle={toggleTag}
            onClear={() => setActiveTags([])}
          />

          {activeTags.map((t) => (
            <FilterChip key={t} mono onClear={() => toggleTag(t)}>
              {t}
            </FilterChip>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto cursor-pointer text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            >
              clear all
            </button>
          )}
        </div>

        <ItemList
          items={results}
          query={query}
          stars={stars}
          onToggleStar={toggleStar}
          activeTags={activeTags}
          onToggleTag={toggleTag}
          emptyHint={emptyHint}
        />
      </main>
    </>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center gap-1.5 border bg-background px-2.5 text-[13px] transition-colors sm:h-8',
        active
          ? 'border-foreground text-foreground'
          : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function FilterChip({
  children,
  onClear,
  mono,
}: {
  children: React.ReactNode;
  onClear: () => void;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center gap-1.5 border border-foreground/30 bg-foreground/10 px-2.5 text-[13px] text-foreground sm:h-8',
        mono && 'font-mono',
      )}
    >
      {children}
      <X className="size-3.5" />
    </button>
  );
}
