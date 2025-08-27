import type { Node } from 'web-tree-sitter';

const TYPE = 'comma' as const;

/**
 * Represents a comma in the graphql AST.
 */
export interface Comma extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Comma
 */
export function isComma(node: unknown): node is Comma {
  return (node as any)?.type === TYPE;
}