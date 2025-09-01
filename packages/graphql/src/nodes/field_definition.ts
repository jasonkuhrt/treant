import type { Node } from 'web-tree-sitter';
import type { ArgumentsDefinitionNode } from './arguments_definition.js';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';
import type { TypeNode } from './type.js';

const TYPE = 'field_definition' as const;

/**
 * Represents a field definition in the graphql AST.
 */
export interface FieldDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FieldDefinitionNode
 */
export function isFieldDefinitionNode(node: unknown): node is FieldDefinitionNode {
  return (node as any)?.type === TYPE;
}