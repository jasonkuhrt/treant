import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { EnumValueNode } from './enum_value.js';

const TYPE = 'enum_value_definition' as const;

/**
 * Represents a enum value definition in the graphql AST.
 */
export interface EnumValueDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumValueDefinitionNode
 */
export function isEnumValueDefinitionNode(node: unknown): node is EnumValueDefinitionNode {
  return (node as any)?.type === TYPE;
}