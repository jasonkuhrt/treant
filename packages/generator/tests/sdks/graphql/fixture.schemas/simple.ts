/**
 * Simple GraphQL fixture - loaded at module level
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const simple = readFileSync(
  join(__dirname, 'simple.graphql'),
  'utf-8'
);