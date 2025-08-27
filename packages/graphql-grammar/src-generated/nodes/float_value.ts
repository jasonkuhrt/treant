import type { Node } from 'web-tree-sitter';

const TYPE = 'float_value' as const;

/**
 * Represents a float value in the graphql AST.
 */
export interface FloatValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FloatValue
 */
export function isFloatValue(node: unknown): node is FloatValue {
  return (node as any)?.type === TYPE;
}