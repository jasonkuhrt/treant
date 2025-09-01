import type { Node } from 'web-tree-sitter';

const TYPE = 'identifier' as const;

/**
 * Represents a identifier in the identifier AST.
 */
export interface IdentifierNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for IdentifierNode
 */
export function isIdentifierNode(node: unknown): node is IdentifierNode {
  return (node as any)?.type === TYPE;
}