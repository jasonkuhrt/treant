import type { Node } from 'web-tree-sitter';
import type { ValueNode } from './value.js';

const TYPE = 'list_value' as const;

/**
 * Represents a list value in the graphql AST.
 */
export interface ListValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ListValueNode
 */
export function isListValueNode(node: unknown): node is ListValueNode {
  return (node as any)?.type === TYPE;
}