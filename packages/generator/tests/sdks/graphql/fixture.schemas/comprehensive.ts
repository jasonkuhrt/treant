/**
 * Comprehensive GraphQL fixture - loaded at module level
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const comprehensive = readFileSync(
  join(__dirname, 'comprehensive.graphql'),
  'utf-8'
);