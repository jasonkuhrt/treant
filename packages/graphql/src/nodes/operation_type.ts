import type { Node } from 'web-tree-sitter';

const TYPE = 'operation_type' as const;

/**
 * Represents a operation type in the graphql AST.
 */
export interface OperationTypeNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for OperationTypeNode
 */
export function isOperationTypeNode(node: unknown): node is OperationTypeNode {
  return (node as any)?.type === TYPE;
}