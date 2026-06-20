import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bookmark, Check, Copy, Star } from 'lucide-react';

import type { Item } from '@/lib/schema';
import { iconForLink } from '@/lib/itemMeta';
import { copyText } from '@/lib/clipboard';
import { cn, formatTag } from '@/lib/utils';

export function ItemRow({
  item,
  query,
  bookmarked,
  onToggleBookmark,
  activeTags,
  onToggleTag,
}: {
  item: Item;
  query: string;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  activeTags: string[];
  onToggleTag: (t: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const toggle = () => setOpen((o) => !o);

  // A drag that selects text shouldn't collapse/expand the row — keep text copyable.
  const onActivate = () => {
    if (window.getSelection()?.toString()) return;
    toggle();
  };

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (await copyText(shareText(item))) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    }
  };

  return (
    <div
      onClick={onActivate}
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      className="group cursor-pointer border-b border-border/60 py-4"
    >
      {/* title + authors, with the row actions (bookmark, copy) in the corner */}
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-muted-foreground">
            {item.starred && (
              <Star
                aria-label="Starred"
                className="mr-1 inline-block size-3.5 align-[-0.01em] fill-popvax text-popvax"
              />
            )}
            <Highlight text={item.title} query={query} />
          </h2>
          {item.authors.length > 0 && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <Highlight text={authorLine(item.authors)} query={query} />
            </p>
          )}
        </div>

        <div className="-mr-1.5 flex shrink-0 items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item.id);
            }}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            aria-pressed={bookmarked}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            className="cursor-pointer p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bookmark className={cn('size-4', bookmarked && 'fill-popvax text-popvax')} />
          </button>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy to share"
            title="Copy to share"
            className="cursor-pointer p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="size-4 text-popvax" /> : <Copy className="size-4" />}
          </button>
        </div>
      </div>

      {/* tags */}
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.tags.map((t) => {
            const on = activeTags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTag(t);
                }}
                className={cn(
                  'cursor-pointer border px-1.5 pb-1 pt-[5px] font-mono text-[11px] leading-none transition-colors',
                  on
                    ? 'border-foreground/30 bg-foreground/10 text-foreground'
                    : 'border-border bg-background text-foreground/80 hover:border-foreground/50 hover:text-foreground',
                )}
              >
                {formatTag(t)}
              </button>
            );
          })}
        </div>
      )}

      {/* expanded: description + links */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="max-w-2xl pt-3 text-base leading-relaxed text-foreground/80">
              <Highlight text={item.summary} query={query} />
            </p>

            {item.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.links.map((l) => {
                  const LinkIcon = iconForLink(l.url, l.label);
                  return (
                    <a
                      key={l.url + l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex cursor-pointer items-center gap-1.5 bg-foreground px-3 py-2 text-sm text-background transition-colors hover:bg-foreground/85 sm:px-2.5 sm:py-1 sm:text-[13px]"
                    >
                      <LinkIcon className="size-4" />
                      {l.label}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function authorLine(authors: string[]) {
  return authors.slice(0, 8).join(', ') + (authors.length > 8 ? ' et al.' : '');
}

/** Plain-text block for sharing an item (pastes cleanly anywhere). */
function shareText(item: Item): string {
  const lines = [item.title];
  if (item.summary) lines.push('', item.summary);
  if (item.links.length) {
    lines.push('');
    for (const l of item.links) lines.push(`${l.label}: ${l.url}`);
  }
  return lines.join('\n');
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Highlight the search terms within a piece of text, in PopVax purple. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const terms = q.split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!terms.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${terms.join('|')})`, 'ig'));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-popvax/30 text-inherit">
            {p}
          </mark>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}
