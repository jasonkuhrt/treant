#!/usr/bin/env tsx
/**
 * Main entry point for generating all DSL-related files
 */

import { execSync } from 'node:child_process';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Generating DSL files...\n');

try {
  // Step 1: Sync types from tree-sitter-cli
  console.log('Syncing types from tree-sitter-cli...');
  execSync(`tsx ${path.join(__dirname, 'types.ts')}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../..'),
  });

  // Step 2: Create ES module from tree-sitter DSL
  console.log('\nCreating ES module from tree-sitter DSL...');
  execSync(`tsx ${path.join(__dirname, 'values.ts')}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../..'),
  });

  console.log('\nDSL generation complete!');
}
catch (error) {
  console.error('\nDSL generation failed:', error);
  process.exit(1);
}
