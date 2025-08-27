import type { Node } from 'web-tree-sitter';

const TYPE = 'int_value' as const;

/**
 * Represents a int value in the graphql AST.
 */
export interface IntValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for IntValue
 */
export function isIntValue(node: unknown): node is IntValue {
  return (node as any)?.type === TYPE;
}