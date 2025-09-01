import type { Node } from 'web-tree-sitter';
import type { BooleanValueNode } from './boolean_value.js';
import type { EnumValueNode } from './enum_value.js';
import type { FloatValueNode } from './float_value.js';
import type { IntValueNode } from './int_value.js';
import type { ListValueNode } from './list_value.js';
import type { NullValueNode } from './null_value.js';
import type { ObjectValueNode } from './object_value.js';
import type { StringValueNode } from './string_value.js';
import type { VariableNode } from './variable.js';

const TYPE = 'value' as const;

/**
 * Represents a value in the graphql AST.
 */
export interface ValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ValueNode
 */
export function isValueNode(node: unknown): node is ValueNode {
  return (node as any)?.type === TYPE;
}