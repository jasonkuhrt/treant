import type { Node } from 'web-tree-sitter';

const TYPE = 'float_value' as const;

/**
 * Represents a float value in the graphql AST.
 */
export interface FloatValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FloatValueNode
 */
export function isFloatValueNode(node: unknown): node is FloatValueNode {
  return (node as any)?.type === TYPE;
}