import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { FragmentName } from './fragment_name.js';

const TYPE = 'fragment_spread' as const;

/**
 * Represents a fragment spread in the graphql AST.
 */
export interface FragmentSpread extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FragmentSpread
 */
export function isFragmentSpread(node: unknown): node is FragmentSpread {
  return (node as any)?.type === TYPE;
}