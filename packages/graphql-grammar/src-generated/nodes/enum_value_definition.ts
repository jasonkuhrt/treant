import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { EnumValue } from './enum_value.js';

const TYPE = 'enum_value_definition' as const;

/**
 * Represents a enum value definition in the graphql AST.
 */
export interface EnumValueDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumValueDefinition
 */
export function isEnumValueDefinition(node: unknown): node is EnumValueDefinition {
  return (node as any)?.type === TYPE;
}