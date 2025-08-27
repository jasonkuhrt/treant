import type { Node } from 'web-tree-sitter';
import type { EnumValueDefinition } from './enum_value_definition.js';

const TYPE = 'enum_values_definition' as const;

/**
 * Represents a enum values definition in the graphql AST.
 */
export interface EnumValuesDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumValuesDefinition
 */
export function isEnumValuesDefinition(node: unknown): node is EnumValuesDefinition {
  return (node as any)?.type === TYPE;
}