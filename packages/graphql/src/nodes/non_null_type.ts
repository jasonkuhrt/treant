import type { Node } from 'web-tree-sitter';
import type { ListTypeNode } from './list_type.js';
import type { NamedTypeNode } from './named_type.js';

const TYPE = 'non_null_type' as const;

/**
 * Represents a non null type in the graphql AST.
 */
export interface NonNullTypeNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NonNullTypeNode
 */
export function isNonNullTypeNode(node: unknown): node is NonNullTypeNode {
  return (node as any)?.type === TYPE;
}