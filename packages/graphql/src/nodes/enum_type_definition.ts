import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { EnumValuesDefinitionNode } from './enum_values_definition.js';
import type { NameNode } from './name.js';

const TYPE = 'enum_type_definition' as const;

/**
 * Represents a enum type definition in the graphql AST.
 */
export interface EnumTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumTypeDefinitionNode
 */
export function isEnumTypeDefinitionNode(node: unknown): node is EnumTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}