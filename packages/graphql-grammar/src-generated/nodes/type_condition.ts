import type { Node } from 'web-tree-sitter';
import type { NamedType } from './named_type.js';

const TYPE = 'type_condition' as const;

/**
 * Represents a type condition in the graphql AST.
 */
export interface TypeCondition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeCondition
 */
export function isTypeCondition(node: unknown): node is TypeCondition {
  return (node as any)?.type === TYPE;
}