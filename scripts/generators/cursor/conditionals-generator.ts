/**
 * Conditionals Generator Module
 *
 * Generates exhaustive conditional return types for cursor navigation methods.
 * These types provide compile-time guarantees about the exact return type
 * based on the current cursor position in the AST.
 */

import type { GrammarAnalysis } from '../core/grammar-analysis.js';
import { emitGeneratedFileHeader } from '../core/type-helpers.js';
import type { CursorConfig } from './cursor-generator.js';

/**
 * Generate exhaustive conditional return types for cursor navigation
 */
export async function generateCursorConditionals(
  analysis: GrammarAnalysis,
  config: CursorConfig,
): Promise<string> {
  const lines: string[] = [];

  // Generated file header with eslint disable
  lines.push(emitGeneratedFileHeader('cursor conditional return types'));

  // Import required types
  lines.push('import type {');
  lines.push('  ChildMap,');
  lines.push('  ParentMap,');
  lines.push('  SiblingMap,');
  lines.push('  PositionalChildMap');
  lines.push('} from \'./maps.js\';');
  lines.push('import type { TreeCursorGraphQL } from \'./cursor.js\';');
  lines.push('');

  // Generate conditional types for each navigation operation
  lines.push('/**');
  lines.push(' * Namespace containing exhaustive conditional return types');
  lines.push(' * for all cursor navigation operations.');
  lines.push(' */');
  lines.push('export namespace CursorConditionals {');

  // Generate GotoFirstChild conditional type
  lines.push('  /**');
  lines.push('   * Conditional return type for gotoFirstChild() operation.');
  lines.push('   * Returns TreeCursorGraphQL with child node type or null if no children.');
  lines.push('   */');
  lines.push('  export type GotoFirstChild<TParent extends string> = ');
  lines.push('    TParent extends keyof ChildMap');
  lines.push('      ? TreeCursorGraphQL<ChildMap[TParent]> | null');
  lines.push('      : TreeCursorGraphQL<string> | null;');
  lines.push('');

  // Generate GotoNextSibling conditional type
  lines.push('  /**');
  lines.push('   * Conditional return type for gotoNextSibling() operation.');
  lines.push('   * Returns TreeCursorGraphQL with sibling node type or null if no siblings.');
  lines.push('   */');
  lines.push('  export type GotoNextSibling<TCurrent extends string> = ');
  lines.push('    TCurrent extends keyof SiblingMap');
  lines.push('      ? TreeCursorGraphQL<SiblingMap[TCurrent]> | null');
  lines.push('      : TreeCursorGraphQL<string> | null;');
  lines.push('');

  // Generate GotoPreviousSibling conditional type
  lines.push('  /**');
  lines.push('   * Conditional return type for gotoPreviousSibling() operation.');
  lines.push('   * Returns TreeCursorGraphQL with sibling node type or null if no siblings.');
  lines.push('   */');
  lines.push('  export type GotoPreviousSibling<TCurrent extends string> = ');
  lines.push('    TCurrent extends keyof SiblingMap');
  lines.push('      ? TreeCursorGraphQL<SiblingMap[TCurrent]> | null');
  lines.push('      : TreeCursorGraphQL<string> | null;');
  lines.push('');

  // Generate GotoParent conditional type
  lines.push('  /**');
  lines.push('   * Conditional return type for gotoParent() operation.');
  lines.push('   * Returns TreeCursorGraphQL with parent node type or null if no parent.');
  lines.push('   */');
  lines.push('  export type GotoParent<TChild extends string> = ');
  lines.push('    TChild extends keyof ParentMap');
  lines.push('      ? TreeCursorGraphQL<ParentMap[TChild]> | null');
  lines.push('      : TreeCursorGraphQL<string> | null;');
  lines.push('');

  // Generate exhaustive navigation paths for deep traversal
  lines.push('  /**');
  lines.push('   * Multi-step navigation path type for complex traversals.');
  lines.push('   * Enables type-safe navigation along predefined paths.');
  lines.push('   */');
  lines.push('  export type NavigationPath<');
  lines.push('    TStart extends string,');
  lines.push('    TPath extends readonly string[]');
  lines.push('  > = TPath extends readonly [infer TFirst, ...infer TRest]');
  lines.push('    ? TFirst extends string');
  lines.push('      ? TRest extends readonly string[]');
  lines.push('        ? TStart extends keyof ChildMap');
  lines.push('          ? TFirst extends ChildMap[TStart]');
  lines.push('            ? NavigationPath<TFirst, TRest>');
  lines.push('            : never');
  lines.push('          : never');
  lines.push('        : TFirst');
  lines.push('      : never');
  lines.push('    : TStart;');
  lines.push('');

  // Generate validation types for cursor positions
  lines.push('  /**');
  lines.push('   * Type to validate if a navigation operation is possible.');
  lines.push('   */');
  lines.push('  export type CanNavigate<TFrom extends string, TTo extends string> = ');
  lines.push('    TFrom extends keyof ChildMap');
  lines.push('      ? TTo extends ChildMap[TFrom]');
  lines.push('        ? true');
  lines.push('        : false');
  lines.push('      : false;');
  lines.push('');

  // Generate union types for all possible positions
  lines.push('  /**');
  lines.push('   * Union of all possible node types that can have children.');
  lines.push('   */');
  lines.push('  export type ParentNodeTypes = keyof ChildMap;');
  lines.push('');

  lines.push('  /**');
  lines.push('   * Union of all possible child node types.');
  lines.push('   */');
  lines.push('  export type ChildNodeTypes = ChildMap[keyof ChildMap];');
  lines.push('');

  lines.push('  /**');
  lines.push('   * Union of all possible node types that have siblings.');
  lines.push('   */');
  lines.push('  export type SiblingNodeTypes = keyof SiblingMap;');
  lines.push('');

  // Generate recursive depth-limited types to prevent infinite recursion
  lines.push('  /**');
  lines.push('   * Depth-limited recursive navigation type to prevent infinite recursion.');
  lines.push('   * Limits traversal depth to prevent TypeScript compiler issues.');
  lines.push('   */');
  lines.push('  type RecursiveNavigation<');
  lines.push('    T extends string,');
  lines.push(`    Depth extends number = ${config.maxDepth}`);
  lines.push('  > = [Depth] extends [0]');
  lines.push('    ? T');
  lines.push('    : T extends keyof ChildMap');
  lines.push('    ? T | RecursiveNavigation<ChildMap[T], Prev<Depth>>');
  lines.push('    : T;');
  lines.push('');

  // Helper type for depth counting
  lines.push('  /**');
  lines.push('   * Helper type to decrement depth counter for recursion control.');
  lines.push('   */');
  lines.push('  type Prev<T extends number> = T extends 0');
  lines.push('    ? never');
  lines.push('    : T extends 1 ? 0');
  lines.push('    : T extends 2 ? 1');
  lines.push('    : T extends 3 ? 2');
  lines.push('    : T extends 4 ? 3');
  lines.push('    : T extends 5 ? 4');
  lines.push('    : T extends 6 ? 5');
  lines.push('    : T extends 7 ? 6');
  lines.push('    : T extends 8 ? 7');
  lines.push('    : number;');
  lines.push('');

  // Generate specific conditional types for common GraphQL patterns
  if (analysis.grammarName === 'graphql') {
    lines.push('  /**');
    lines.push('   * GraphQL-specific conditional types for common navigation patterns.');
    lines.push('   */');

    // Field navigation
    lines.push('  export type NavigateToFieldName<T extends string> = ');
    lines.push('    T extends "field"');
    lines.push('      ? TreeCursorGraphQL<"name"> | null');
    lines.push('      : null;');
    lines.push('');

    // Type navigation
    lines.push('  export type NavigateToTypeName<T extends string> = ');
    lines.push('    T extends "named_type"');
    lines.push('      ? TreeCursorGraphQL<"name"> | null');
    lines.push('      : null;');
    lines.push('');

    // Fragment navigation
    lines.push('  export type NavigateToFragmentTarget<T extends string> = ');
    lines.push('    T extends "fragment_definition"');
    lines.push('      ? TreeCursorGraphQL<"type_condition"> | null');
    lines.push('      : null;');
    lines.push('');
  }

  lines.push('}'); // Close CursorConditionals namespace
  lines.push('');

  // Generate helper functions for runtime cursor validation
  lines.push('/**');
  lines.push(' * Runtime helper functions for cursor navigation validation.');
  lines.push(' */');
  lines.push('export namespace CursorValidation {');

  lines.push('  /**');
  lines.push('   * Check if a node type can have children.');
  lines.push('   */');
  lines.push('  export function canHaveChildren(nodeType: string): boolean {');
  lines.push('    // Implementation will be generated based on ChildMap');
  lines.push('    return true; // Placeholder');
  lines.push('  }');
  lines.push('');

  lines.push('  /**');
  lines.push('   * Get possible child types for a parent node.');
  lines.push('   */');
  lines.push('  export function getPossibleChildTypes(parentType: string): readonly string[] {');
  lines.push('    // Implementation will be generated based on ChildMap');
  lines.push('    return []; // Placeholder');
  lines.push('  }');
  lines.push('');

  lines.push('  /**');
  lines.push('   * Check if navigation from one node type to another is valid.');
  lines.push('   */');
  lines.push('  export function isValidNavigation(from: string, to: string): boolean {');
  lines.push('    // Implementation will be generated based on relationship maps');
  lines.push('    return true; // Placeholder');
  lines.push('  }');
  lines.push('');

  lines.push('}'); // Close CursorValidation namespace
  lines.push('');

  return lines.join('\n');
}
