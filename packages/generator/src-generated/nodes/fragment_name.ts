import type { Node } from 'web-tree-sitter';
import type { Name } from './name.js';

const TYPE = 'fragment_name' as const;

/**
 * Represents a fragment name in the graphql AST.
 */
export interface FragmentName extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FragmentName
 */
export function isFragmentName(node: unknown): node is FragmentName {
  return (node as any)?.type === TYPE;
}