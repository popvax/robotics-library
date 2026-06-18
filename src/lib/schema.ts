import { z } from 'zod';

/** Optional categorisation kept on disk for the future; not shown in the UI. */
export const ITEM_TYPES = [
  'paper',
  'website',
  'repo',
  'blog',
  'dataset',
  'video',
  'tweet',
  'course',
  'hardware',
  'other',
] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const LinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});
export type Link = z.infer<typeof LinkSchema>;

/**
 * The on-disk shape of a single `content/<id>.json` entry.
 * `id` is injected from the filename when loaded, so the filename is the slug.
 * Unknown keys (e.g. a legacy `featured`) are stripped, not rejected.
 */
export const ItemSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  authors: z.array(z.string().min(1)).default([]),
  links: z.array(LinkSchema).default([]),
  type: z.enum(ITEM_TYPES).optional(),
  date: z.string().optional(),
  venue: z.string().optional(),
  image: z.string().url().optional(),
  addedAt: z.string().optional(),
});

/** The shape the app consumes — `id` is guaranteed present after loading. */
export type Item = z.infer<typeof ItemSchema> & { id: string };
