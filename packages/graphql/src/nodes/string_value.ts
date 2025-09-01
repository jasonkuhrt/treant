import type { Node } from 'web-tree-sitter';

const TYPE = 'string_value' as const;

/**
 * Represents a string value in the graphql AST.
 */
export interface StringValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for StringValueNode
 */
export function isStringValueNode(node: unknown): node is StringValueNode {
  return (node as any)?.type === TYPE;
}