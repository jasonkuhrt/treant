import type { Node } from 'web-tree-sitter';

const TYPE = 'boolean_value' as const;

/**
 * Represents a boolean value in the graphql AST.
 */
export interface BooleanValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for BooleanValue
 */
export function isBooleanValue(node: unknown): node is BooleanValue {
  return (node as any)?.type === TYPE;
}