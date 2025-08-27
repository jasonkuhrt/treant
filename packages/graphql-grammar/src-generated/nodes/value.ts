import type { Node } from 'web-tree-sitter';
import type { BooleanValue } from './boolean_value.js';
import type { EnumValue } from './enum_value.js';
import type { FloatValue } from './float_value.js';
import type { IntValue } from './int_value.js';
import type { ListValue } from './list_value.js';
import type { NullValue } from './null_value.js';
import type { ObjectValue } from './object_value.js';
import type { StringValue } from './string_value.js';
import type { Variable } from './variable.js';

const TYPE = 'value' as const;

/**
 * Represents a value in the graphql AST.
 */
export interface Value extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Value
 */
export function isValue(node: unknown): node is Value {
  return (node as any)?.type === TYPE;
}