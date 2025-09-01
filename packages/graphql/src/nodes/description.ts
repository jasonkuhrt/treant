import type { Node } from 'web-tree-sitter';
import type { StringValueNode } from './string_value.js';

const TYPE = 'description' as const;

/**
 * Represents a description in the graphql AST.
 */
export interface DescriptionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DescriptionNode
 */
export function isDescriptionNode(node: unknown): node is DescriptionNode {
  return (node as any)?.type === TYPE;
}