import type { Node } from 'web-tree-sitter';
import type { Comma } from './comma.js';
import type { DefaultValue } from './default_value.js';
import type { Directives } from './directives.js';
import type { Type } from './type.js';
import type { Variable } from './variable.js';

const TYPE = 'variable_definition' as const;

/**
 * Represents a variable definition in the graphql AST.
 */
export interface VariableDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for VariableDefinition
 */
export function isVariableDefinition(node: unknown): node is VariableDefinition {
  return (node as any)?.type === TYPE;
}