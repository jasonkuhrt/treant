import type { Node } from 'web-tree-sitter';
import type { NameNode } from './name.js';

const TYPE = 'named_type' as const;

/**
 * Represents a named type in the graphql AST.
 */
export interface NamedTypeNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NamedTypeNode
 */
export function isNamedTypeNode(node: unknown): node is NamedTypeNode {
  return (node as any)?.type === TYPE;
}