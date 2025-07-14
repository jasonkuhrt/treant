#!/usr/bin/env tsx

/**
 * Generate RuleName type from tree-sitter node-types.json
 * 
 * This script reads the generated node-types.json file and extracts all named node types
 * to create a TypeScript union type. This eliminates the need for manual maintenance
 * of the RuleName type in the grammar file.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import nodeTypes from '../parser/src/node-types.json' with { type: 'json' };

// TypeScript now infers the type from the JSON structure
// nodeTypes is typed as: Array<{ type: string, named: boolean, fields: {...}, children?: {...} }>

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Paths
const outputPath = join(projectRoot, 'grammar/types.generated.ts');

try {
  // Extract named node types (these become the RuleName union)
  const namedTypes: string[] = nodeTypes
    .filter(node => node.named === true)
    .map(node => node.type)
    .sort(); // Sort for consistent output

  console.log(`Found ${namedTypes.length} named node types`);

  // Generate TypeScript union type
  const unionTypeLines = namedTypes.map(type => `  | '${type}'`);
  const typeDefinition = `export type RuleName =\n${unionTypeLines.join('\n')};`;

  // Generate file content
  const fileContent = `// Auto-generated from parser/src/node-types.json
// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-types.ts

${typeDefinition}
`;

  // Write the generated file
  writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`Generated RuleName type with ${namedTypes.length} entries -> ${outputPath}`);

} catch (error) {
  console.error('Error generating RuleName type:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}