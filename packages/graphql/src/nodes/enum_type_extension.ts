import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { EnumValuesDefinitionNode } from './enum_values_definition.js';
import type { NameNode } from './name.js';

const TYPE = 'enum_type_extension' as const;

/**
 * Represents a enum type extension in the graphql AST.
 */
export interface EnumTypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumTypeExtensionNode
 */
export function isEnumTypeExtensionNode(node: unknown): node is EnumTypeExtensionNode {
  return (node as any)?.type === TYPE;
}