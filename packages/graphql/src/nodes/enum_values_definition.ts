import type { Node } from 'web-tree-sitter';
import type { EnumValueDefinitionNode } from './enum_value_definition.js';

const TYPE = 'enum_values_definition' as const;

/**
 * Represents a enum values definition in the graphql AST.
 */
export interface EnumValuesDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumValuesDefinitionNode
 */
export function isEnumValuesDefinitionNode(node: unknown): node is EnumValuesDefinitionNode {
  return (node as any)?.type === TYPE;
}