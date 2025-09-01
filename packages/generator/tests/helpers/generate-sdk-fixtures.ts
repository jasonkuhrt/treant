/**
 * Generate test fixtures including WASM for SDK tests
 */

import { Grammar } from '@treant/grammar';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { emit, generate } from '../../src/generator.js';

const generateSdkFixtures = async () => {
  // Find all SDK case directories in the sdks folder
  const testDir = path.join(import.meta.dirname!, '..');
  const sdksDir = path.join(testDir, 'sdks');
  const entries = await fs.readdir(sdksDir, { withFileTypes: true });
  const caseDirs = entries.filter(entry => entry.isDirectory());

  for (const caseDir of caseDirs) {
    const caseName = caseDir.name;
    const casePathBase = path.join(sdksDir, caseName);
    const grammarFile = `${caseName}.grammar.fix.ts`;
    const grammarPath = path.join(casePathBase, grammarFile);

    // Check if grammar file exists
    try {
      await fs.access(grammarPath);
    }
    catch {
      continue; // Skip directories without grammar files
    }

    console.log(`Generating fixtures for ${caseName}...`);

    // Import the grammar from the grammar file
    const grammarModule = await import(grammarPath);
    if (!grammarModule.grammar) {
      console.log(`  ⚠ No grammar export found in ${grammarFile}, skipping`);
      continue;
    }

    const grammar = grammarModule.grammar;
    const builtGrammar = await Grammar.generateAsync(grammar, { wasm: true, cache: true });

    const sdk = await generate({
      grammar: builtGrammar,
    });

    // Generate SDK in case directory as caseName.sdk.fix
    const sdkDir = path.join(casePathBase, `${caseName}.sdk.fix`);
    await emit(sdk, sdkDir);

    console.log(`  ✓ Generated WASM, artifacts and SDK for ${caseName}`);
  }

  console.log('\nAll test fixtures generated successfully with WASM');
};

generateSdkFixtures().catch(console.error);
