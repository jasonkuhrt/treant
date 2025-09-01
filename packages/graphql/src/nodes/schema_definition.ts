import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { RootOperationTypeDefinitionNode } from './root_operation_type_definition.js';

const TYPE = 'schema_definition' as const;

/**
 * Represents a schema definition in the graphql AST.
 */
export interface SchemaDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SchemaDefinitionNode
 */
export function isSchemaDefinitionNode(node: unknown): node is SchemaDefinitionNode {
  return (node as any)?.type === TYPE;
}