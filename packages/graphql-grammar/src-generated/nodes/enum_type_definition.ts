import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { EnumValuesDefinition } from './enum_values_definition.js';
import type { Name } from './name.js';

const TYPE = 'enum_type_definition' as const;

/**
 * Represents a enum type definition in the graphql AST.
 */
export interface EnumTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumTypeDefinition
 */
export function isEnumTypeDefinition(node: unknown): node is EnumTypeDefinition {
  return (node as any)?.type === TYPE;
}