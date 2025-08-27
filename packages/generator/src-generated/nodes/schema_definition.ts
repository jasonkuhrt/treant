import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { RootOperationTypeDefinition } from './root_operation_type_definition.js';

const TYPE = 'schema_definition' as const;

/**
 * Represents a schema definition in the graphql AST.
 */
export interface SchemaDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SchemaDefinition
 */
export function isSchemaDefinition(node: unknown): node is SchemaDefinition {
  return (node as any)?.type === TYPE;
}