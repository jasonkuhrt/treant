import type { Node } from 'web-tree-sitter';
import type { Name } from './name.js';

const TYPE = 'alias' as const;

/**
 * Represents a alias in the graphql AST.
 */
export interface Alias extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Alias
 */
export function isAlias(node: unknown): node is Alias {
  return (node as any)?.type === TYPE;
}