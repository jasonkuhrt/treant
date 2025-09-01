import type { Node } from 'web-tree-sitter';
import type { ObjectFieldNode } from './object_field.js';

const TYPE = 'object_value' as const;

/**
 * Represents a object value in the graphql AST.
 */
export interface ObjectValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectValueNode
 */
export function isObjectValueNode(node: unknown): node is ObjectValueNode {
  return (node as any)?.type === TYPE;
}