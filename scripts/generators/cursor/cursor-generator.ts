/**
 * Cursor Generator Module
 *
 * Orchestrates the generation of type-safe cursor navigation system.
 * This module coordinates the creation of cursor position interfaces,
 * conditional return types, and cursor navigation utilities.
 */

import { join } from 'node:path';
import type { GeneratorConfig } from '../core/base-generator.js';
import { generateFileHeader, writeFormattedFile } from '../core/base-generator.js';
import type { GrammarAnalysis } from '../core/grammar-analysis.js';
import { generateCursorConditionals } from './conditionals-generator.js';
import { generateCursorMaps } from './maps-generator.js';

/**
 * Cursor system configuration
 */
export interface CursorConfig {
  /** Maximum depth for exhaustive type generation to prevent infinite recursion */
  maxDepth: number;
  /** Namespace for cursor types to avoid conflicts */
  namespace: string;
}

/**
 * Default cursor configuration
 */
export const DEFAULT_CURSOR_CONFIG: CursorConfig = {
  maxDepth: 8,
  namespace: 'Cursor',
};

/**
 * Generate complete type-safe cursor navigation system
 */
export async function generateCursorSystem(
  config: GeneratorConfig,
  analysis: GrammarAnalysis,
  cursorConfig: CursorConfig = DEFAULT_CURSOR_CONFIG,
): Promise<void> {
  console.log('Generating type-safe cursor navigation system...');

  // Create cursor directory
  const cursorDir = join(config.outputDir, 'cursor');

  // Generate cursor position maps
  console.log('  - Generating cursor position maps...');
  const mapsContent = await generateCursorMaps(analysis, cursorConfig);
  await writeFormattedFile(
    join(cursorDir, 'maps.ts'),
    generateFileHeader('Cursor position maps for type-safe navigation') + mapsContent,
    config.formatter,
  );

  // Generate conditional return types
  console.log('  - Generating conditional return types...');
  const conditionalsContent = await generateCursorConditionals(analysis, cursorConfig);
  await writeFormattedFile(
    join(cursorDir, 'conditionals.ts'),
    generateFileHeader('Exhaustive conditional return types for cursor navigation') + conditionalsContent,
    config.formatter,
  );

  // Generate main cursor interface
  console.log('  - Generating main cursor interface...');
  const cursorContent = generateMainCursorInterface(analysis, cursorConfig);
  await writeFormattedFile(
    join(cursorDir, 'cursor.ts'),
    generateFileHeader('Type-safe cursor interface with exhaustive navigation') + cursorContent,
    config.formatter,
  );

  // Generate cursor barrel export ($$)
  console.log('  - Generating cursor barrel exports ($$.ts)...');
  const cursorBarrelExports = generateCursorBarrelExports(cursorConfig);
  await writeFormattedFile(
    join(cursorDir, '$$.ts'),
    generateFileHeader('Cursor navigation system barrel exports') + cursorBarrelExports,
    config.formatter,
  );

  // Generate cursor namespace export ($)
  console.log('  - Generating cursor namespace export ($.ts)...');
  const cursorNamespaceExport = generateCursorNamespaceExport(cursorConfig);
  await writeFormattedFile(
    join(cursorDir, '$.ts'),
    generateFileHeader('Cursor navigation system namespace export') + cursorNamespaceExport,
    config.formatter,
  );

  console.log('✅ Type-safe cursor navigation system generated successfully');
}

/**
 * Generate the main cursor interface with type-safe navigation methods
 */
function generateMainCursorInterface(
  analysis: GrammarAnalysis,
  config: CursorConfig,
): string {
  const lines: string[] = [];

  // Import required types
  lines.push('import type { TreeCursor, Tree, Node, Point } from \'web-tree-sitter\';');
  lines.push('import type { CursorConditionals } from \'./conditionals.js\';');
  lines.push('');

  // Generate TreeCursorGraphQL interface with chaining
  lines.push('/**');
  lines.push(' * Type-safe GraphQL cursor with chaining navigation and type flow.');
  lines.push(' * Each navigation method returns a new cursor with updated position type,');
  lines.push(' * enabling fluent chaining with compile-time type safety.');
  lines.push(' */');
  lines.push('export interface TreeCursorGraphQL<$Position extends string = string> {');
  lines.push('  // Navigation methods return new cursor with updated type parameter');
  lines.push('  gotoFirstChild(): CursorConditionals.GotoFirstChild<$Position>;');
  lines.push('  gotoNextSibling(): CursorConditionals.GotoNextSibling<$Position>;');
  lines.push('  gotoPreviousSibling(): CursorConditionals.GotoPreviousSibling<$Position>;');
  lines.push('  gotoParent(): CursorConditionals.GotoParent<$Position>;');
  lines.push('');
  lines.push('  // Access to underlying TreeCursor instance');
  lines.push('  readonly raw: TreeCursor;');
  lines.push('');
  lines.push('  // Convenience properties');
  lines.push('  readonly node: Node;');
  lines.push('  readonly nodeType: $Position;');
  lines.push('}');
  lines.push('');

  // Generate dispatch function
  lines.push('/**');
  lines.push(' * Internal dispatch function for cursor navigation.');
  lines.push(' * Calls the specified method on the cursor and returns success boolean.');
  lines.push(' */');
  lines.push('function dispatch(cursor: TreeCursor, method: string): boolean {');
  lines.push('  return (cursor as any)[method]();');
  lines.push('}');
  lines.push('');

  // Generate navigation methods
  const navigationMethods = ['gotoFirstChild', 'gotoNextSibling', 'gotoPreviousSibling', 'gotoParent'];

  // Generate createCursorObject function
  lines.push('/**');
  lines.push(' * Create a cursor object with chaining navigation methods.');
  lines.push(' * Each navigation method returns a new cursor object with updated position.');
  lines.push(' */');
  lines.push('function createCursorObject(cursor: TreeCursor): TreeCursorGraphQL {');
  lines.push('  return {');
  lines.push('    // Navigation methods - all follow same pattern with recursion');

  // Generate all navigation methods
  for (const method of navigationMethods) {
    lines.push(`    ${method}() {`);
    lines.push(`      return dispatch(cursor, '${method}') ? createCursorObject(cursor) : null;`);
    lines.push(`    },`);
  }

  lines.push('');
  lines.push('    // Expose underlying cursor instance');
  lines.push('    raw: cursor,');
  lines.push('');
  lines.push('    // Convenience properties');
  lines.push('    get node() { return cursor.currentNode; },');
  lines.push('    get nodeType() { return cursor.nodeType; },');
  lines.push('    ');
  lines.push('  } as any as TreeCursorGraphQL;');
  lines.push('}');
  lines.push('');

  // Generate factory function
  lines.push('/**');
  lines.push(' * Create a TreeCursorGraphQL from a Tree.');
  lines.push(' * Returns a cursor object with chaining navigation and type flow.');
  lines.push(' */');
  lines.push('export function createTreeCursorGraphQL(tree: Tree): TreeCursorGraphQL {');
  lines.push('  return createCursorObject(tree.walk());');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate cursor barrel exports ($$.ts)
 */
function generateCursorBarrelExports(config: CursorConfig): string {
  const lines: string[] = [];

  // Export main cursor interface
  lines.push('export * from "./cursor.js";');
  lines.push('');

  // Export position maps
  lines.push('export * from "./maps.js";');
  lines.push('');

  // Export conditional types
  lines.push('export * from "./conditionals.js";');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate cursor namespace export ($.ts)
 */
function generateCursorNamespaceExport(config: CursorConfig): string {
  const lines: string[] = [];

  lines.push('/**');
  lines.push(' * Type-safe cursor navigation system.');
  lines.push(' * ');
  lines.push(' * This module provides exhaustive type-safe cursor navigation');
  lines.push(' * with compile-time guarantees about AST structure.');
  lines.push(' */');
  // Just re-export everything without namespace - the parent will add the namespace
  lines.push('export * from "./$$.js";');
  lines.push('');

  return lines.join('\n');
}
