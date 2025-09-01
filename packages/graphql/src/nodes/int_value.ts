import type { Node } from 'web-tree-sitter';

const TYPE = 'int_value' as const;

/**
 * Represents a int value in the graphql AST.
 */
export interface IntValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for IntValueNode
 */
export function isIntValueNode(node: unknown): node is IntValueNode {
  return (node as any)?.type === TYPE;
}