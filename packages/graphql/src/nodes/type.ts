import type { Node } from 'web-tree-sitter';
import type { ListTypeNode } from './list_type.js';
import type { NamedTypeNode } from './named_type.js';
import type { NonNullTypeNode } from './non_null_type.js';

const TYPE = 'type' as const;

/**
 * Represents a type in the graphql AST.
 */
export interface TypeNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeNode
 */
export function isTypeNode(node: unknown): node is TypeNode {
  return (node as any)?.type === TYPE;
}