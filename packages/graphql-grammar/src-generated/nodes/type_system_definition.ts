import type { Node } from 'web-tree-sitter';
import type { DirectiveDefinition } from './directive_definition.js';
import type { SchemaDefinition } from './schema_definition.js';
import type { TypeDefinition } from './type_definition.js';

const TYPE = 'type_system_definition' as const;

/**
 * Represents a type system definition in the graphql AST.
 */
export interface TypeSystemDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeSystemDefinition
 */
export function isTypeSystemDefinition(node: unknown): node is TypeSystemDefinition {
  return (node as any)?.type === TYPE;
}