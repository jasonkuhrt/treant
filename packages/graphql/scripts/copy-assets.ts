#!/usr/bin/env node

import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Resolve the graphql-grammar package location
// Since package.json isn't exported, we resolve a known export and work from there
const grammarWasmPath = require.resolve('@treant/graphql-grammar/wasm');
const grammarRoot = dirname(grammarWasmPath); // grammar.wasm is in the package root

// Define source and destination paths
const outputDir = join(__dirname, '..', 'assets');

// Ensure build directories exist
mkdirSync(outputDir, { recursive: true });

// Copy WASM file
const wasmSrc = join(grammarRoot, 'grammar.wasm');
const wasmDest = join(outputDir, 'grammar.wasm');
copyFileSync(wasmSrc, wasmDest);
console.log('✓ Copied grammar.wasm');

// Copy query files
mkdirSync(join(outputDir, 'queries'), { recursive: true });
const queryFiles = ['highlights.scm', 'formatter.scm'];
for (const file of queryFiles) {
  const src = join(grammarRoot, 'queries', 'graphql', file);
  const dest = join(outputDir, 'queries', file);
  copyFileSync(src, dest);
  console.log(`✓ Copied queries/${file}`);
}

// Copy grammar JSON files
const grammarSrc = join(grammarRoot, 'src', 'grammar.json');
const grammarDest = join(outputDir, 'grammar.json');
copyFileSync(grammarSrc, grammarDest);
console.log('✓ Copied grammar.json');

const nodeTypesSrc = join(grammarRoot, 'src', 'node-types.json');
const nodeTypesDest = join(outputDir, 'node-types.json');
copyFileSync(nodeTypesSrc, nodeTypesDest);
console.log('✓ Copied node-types.json');

console.log('\n✅ All assets copied successfully');
