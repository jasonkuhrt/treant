import type { Node } from 'web-tree-sitter';
import type { NamedTypeNode } from './named_type.js';

const TYPE = 'type_condition' as const;

/**
 * Represents a type condition in the graphql AST.
 */
export interface TypeConditionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeConditionNode
 */
export function isTypeConditionNode(node: unknown): node is TypeConditionNode {
  return (node as any)?.type === TYPE;
}