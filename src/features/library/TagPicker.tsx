import * as React from 'react';
import { Popover } from 'radix-ui';
import { Check, ChevronDown, Tag } from 'lucide-react';

import { cn, formatTag } from '@/lib/utils';

export function TagPicker({
  tags,
  active,
  onToggle,
  onClear,
}: {
  tags: { tag: string; count: number }[];
  active: string[];
  onToggle: (t: string) => void;
  onClear: () => void;
}) {
  const [q, setQ] = React.useState('');
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? tags.filter((t) => t.tag.includes(needle) || formatTag(t.tag).includes(needle))
    : tags;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-10 cursor-pointer items-center gap-1.5 border bg-background px-2.5 text-[13px] transition-colors sm:h-8',
            active.length
              ? 'border-foreground text-foreground'
              : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
          )}
        >
          <Tag className="size-4" />
          Tags
          {active.length > 0 && <span className="font-mono text-xs opacity-70">{active.length}</span>}
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-64 border border-border bg-popover text-popover-foreground"
        >
          <div className="border-b border-border p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter tags…"
              autoFocus
              spellCheck={false}
              className="w-full bg-transparent px-1 py-0.5 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
            />
          </div>
          <div className="max-h-72 overflow-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">No tags</p>
            ) : (
              filtered.map(({ tag, count }) => {
                const on = active.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onToggle(tag)}
                    className="flex w-full cursor-pointer items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-muted"
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center border',
                        on ? 'border-foreground bg-foreground/10 text-foreground' : 'border-border',
                      )}
                    >
                      {on && <Check className="size-3" />}
                    </span>
                    <span className="flex-1 truncate font-mono text-[13px]">{formatTag(tag)}</span>
                    <span className="font-mono text-xs text-muted-foreground">{count}</span>
                  </button>
                );
              })
            )}
          </div>
          {active.length > 0 && (
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={onClear}
                className="w-full cursor-pointer px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Clear {active.length} selected
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
