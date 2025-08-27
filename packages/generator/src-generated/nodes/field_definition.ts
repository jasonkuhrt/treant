import type { Node } from 'web-tree-sitter';
import type { ArgumentsDefinition } from './arguments_definition.js';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { Name } from './name.js';
import type { Type } from './type.js';

const TYPE = 'field_definition' as const;

/**
 * Represents a field definition in the graphql AST.
 */
export interface FieldDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FieldDefinition
 */
export function isFieldDefinition(node: unknown): node is FieldDefinition {
  return (node as any)?.type === TYPE;
}