/**
 * Validate every content/*.json against the entry schema.
 * Run with: pnpm validate
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ItemSchema } from '../src/lib/schema';

const here = dirname(fileURLToPath(import.meta.url));
const contentDir = join(here, '..', 'content');

const files = readdirSync(contentDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

let errors = 0;
const seen = new Set<string>();

for (const file of files) {
  const slug = file.replace(/\.json$/, '');

  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    console.error(`✗ ${file}: filename must be lowercase kebab-case (a–z, 0–9, hyphens)`);
    errors++;
  }
  if (seen.has(slug)) {
    console.error(`✗ ${file}: duplicate id "${slug}"`);
    errors++;
  }
  seen.add(slug);

  let data: unknown;
  try {
    data = JSON.parse(readFileSync(join(contentDir, file), 'utf8'));
  } catch (e) {
    console.error(`✗ ${file}: invalid JSON — ${(e as Error).message}`);
    errors++;
    continue;
  }

  const parsed = ItemSchema.safeParse(data);
  if (!parsed.success) {
    console.error(`✗ ${file}:`);
    for (const issue of parsed.error.issues) {
      console.error(`    ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n✗ ${errors} problem(s) across ${files.length} file(s).`);
  process.exit(1);
}
console.log(`✓ ${files.length} entries valid.`);
