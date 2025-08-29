#!/usr/bin/env tsx
/**
 * Downloads and converts tree-sitter DSL to ES module
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Download the tree-sitter DSL source
const sourceUrl = 'https://raw.githubusercontent.com/tree-sitter/tree-sitter/master/crates/generate/src/dsl.js';

console.log('Downloading tree-sitter DSL from:', sourceUrl);
const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Failed to download: ${response.statusText}`);
}
let dslSource = await response.text();

// Remove any existing @ts-nocheck comments
dslSource = dslSource.replace(/^\/\/ @ts-nocheck\n?/gm, '');

// Find where the globals start (this is where we'll cut)
const globalStart = dslSource.indexOf('\nglobalThis.');

// Take everything before the global assignments (including the newline)
const functionsCode = dslSource.substring(0, globalStart);

// Create module with minimal changes - just add exports at the end
const moduleCode = `// @ts-nocheck
${functionsCode}

// Export all DSL functions
export {
  alias,
  blank,
  choice,
  field,
  optional,
  prec,
  repeat,
  repeat1,
  seq,
  sym,
  token,
  grammar,
  RustRegex
};
`;

// Write the module as TypeScript file
fs.writeFileSync(path.join(__dirname, '../../src/generated/dsl/dsl-impl.ts'), moduleCode);

console.log('✅ Created ES module from tree-sitter DSL with minimal changes');