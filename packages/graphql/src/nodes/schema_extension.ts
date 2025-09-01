import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { RootOperationTypeDefinitionNode } from './root_operation_type_definition.js';

const TYPE = 'schema_extension' as const;

/**
 * Represents a schema extension in the graphql AST.
 */
export interface SchemaExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SchemaExtensionNode
 */
export function isSchemaExtensionNode(node: unknown): node is SchemaExtensionNode {
  return (node as any)?.type === TYPE;
}