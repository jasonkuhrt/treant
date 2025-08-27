import type { Node } from 'web-tree-sitter';

const TYPE = 'type_system_directive_location' as const;

/**
 * Represents a type system directive location in the graphql AST.
 */
export interface TypeSystemDirectiveLocation extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeSystemDirectiveLocation
 */
export function isTypeSystemDirectiveLocation(node: unknown): node is TypeSystemDirectiveLocation {
  return (node as any)?.type === TYPE;
}