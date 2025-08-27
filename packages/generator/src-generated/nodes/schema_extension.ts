import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { RootOperationTypeDefinition } from './root_operation_type_definition.js';

const TYPE = 'schema_extension' as const;

/**
 * Represents a schema extension in the graphql AST.
 */
export interface SchemaExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SchemaExtension
 */
export function isSchemaExtension(node: unknown): node is SchemaExtension {
  return (node as any)?.type === TYPE;
}