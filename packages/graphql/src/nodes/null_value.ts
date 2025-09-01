import type { Node } from 'web-tree-sitter';

const TYPE = 'null_value' as const;

/**
 * Represents a null value in the graphql AST.
 */
export interface NullValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NullValueNode
 */
export function isNullValueNode(node: unknown): node is NullValueNode {
  return (node as any)?.type === TYPE;
}