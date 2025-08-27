import type { Node } from 'web-tree-sitter';

const TYPE = 'null_value' as const;

/**
 * Represents a null value in the graphql AST.
 */
export interface NullValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NullValue
 */
export function isNullValue(node: unknown): node is NullValue {
  return (node as any)?.type === TYPE;
}