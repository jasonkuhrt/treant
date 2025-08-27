import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { EnumValuesDefinition } from './enum_values_definition.js';
import type { Name } from './name.js';

const TYPE = 'enum_type_extension' as const;

/**
 * Represents a enum type extension in the graphql AST.
 */
export interface EnumTypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumTypeExtension
 */
export function isEnumTypeExtension(node: unknown): node is EnumTypeExtension {
  return (node as any)?.type === TYPE;
}