import type { Node } from 'web-tree-sitter';
import type { ValueNode } from './value.js';

const TYPE = 'default_value' as const;

/**
 * Represents a default value in the graphql AST.
 */
export interface DefaultValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DefaultValueNode
 */
export function isDefaultValueNode(node: unknown): node is DefaultValueNode {
  return (node as any)?.type === TYPE;
}