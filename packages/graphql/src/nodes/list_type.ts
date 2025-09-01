import type { Node } from 'web-tree-sitter';
import type { TypeNode } from './type.js';

const TYPE = 'list_type' as const;

/**
 * Represents a list type in the graphql AST.
 */
export interface ListTypeNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ListTypeNode
 */
export function isListTypeNode(node: unknown): node is ListTypeNode {
  return (node as any)?.type === TYPE;
}