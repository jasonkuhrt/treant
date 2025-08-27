import type { Node } from 'web-tree-sitter';
import type { Name } from './name.js';

const TYPE = 'enum_value' as const;

/**
 * Represents a enum value in the graphql AST.
 */
export interface EnumValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumValue
 */
export function isEnumValue(node: unknown): node is EnumValue {
  return (node as any)?.type === TYPE;
}