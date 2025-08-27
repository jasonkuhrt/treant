import type { Node } from 'web-tree-sitter';
import type { SchemaExtension } from './schema_extension.js';
import type { TypeExtension } from './type_extension.js';

const TYPE = 'type_system_extension' as const;

/**
 * Represents a type system extension in the graphql AST.
 */
export interface TypeSystemExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeSystemExtension
 */
export function isTypeSystemExtension(node: unknown): node is TypeSystemExtension {
  return (node as any)?.type === TYPE;
}