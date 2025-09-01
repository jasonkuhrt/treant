import type { Node } from 'web-tree-sitter';

const TYPE = 'boolean_value' as const;

/**
 * Represents a boolean value in the graphql AST.
 */
export interface BooleanValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for BooleanValueNode
 */
export function isBooleanValueNode(node: unknown): node is BooleanValueNode {
  return (node as any)?.type === TYPE;
}