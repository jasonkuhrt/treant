import type { Node } from 'web-tree-sitter';

const TYPE = 'comma' as const;

/**
 * Represents a comma in the graphql AST.
 */
export interface CommaNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for CommaNode
 */
export function isCommaNode(node: unknown): node is CommaNode {
  return (node as any)?.type === TYPE;
}