import type { Node } from 'web-tree-sitter';

const TYPE = 'type_system_directive_location' as const;

/**
 * Represents a type system directive location in the graphql AST.
 */
export interface TypeSystemDirectiveLocationNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeSystemDirectiveLocationNode
 */
export function isTypeSystemDirectiveLocationNode(node: unknown): node is TypeSystemDirectiveLocationNode {
  return (node as any)?.type === TYPE;
}