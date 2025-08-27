import type { Node } from 'web-tree-sitter';
import type { DefaultValue } from './default_value.js';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { Name } from './name.js';
import type { Type } from './type.js';

const TYPE = 'input_value_definition' as const;

/**
 * Represents a input value definition in the graphql AST.
 */
export interface InputValueDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputValueDefinition
 */
export function isInputValueDefinition(node: unknown): node is InputValueDefinition {
  return (node as any)?.type === TYPE;
}