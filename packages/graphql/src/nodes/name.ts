import type { Node } from 'web-tree-sitter';

const TYPE = 'name' as const;

/**
 * Represents a name in the graphql AST.
 */
export interface NameNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NameNode
 */
export function isNameNode(node: unknown): node is NameNode {
  return (node as any)?.type === TYPE;
}