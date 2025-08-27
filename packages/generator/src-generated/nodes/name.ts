import type { Node } from 'web-tree-sitter';

const TYPE = 'name' as const;

/**
 * Represents a name in the graphql AST.
 */
export interface Name extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Name
 */
export function isName(node: unknown): node is Name {
  return (node as any)?.type === TYPE;
}