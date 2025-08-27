import type { Node } from 'web-tree-sitter';

const TYPE = 'operation_type' as const;

/**
 * Represents a operation type in the graphql AST.
 */
export interface OperationType extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for OperationType
 */
export function isOperationType(node: unknown): node is OperationType {
  return (node as any)?.type === TYPE;
}