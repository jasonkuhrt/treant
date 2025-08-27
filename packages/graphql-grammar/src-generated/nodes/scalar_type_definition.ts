import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { Name } from './name.js';

const TYPE = 'scalar_type_definition' as const;

/**
 * Represents a scalar type definition in the graphql AST.
 */
export interface ScalarTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ScalarTypeDefinition
 */
export function isScalarTypeDefinition(node: unknown): node is ScalarTypeDefinition {
  return (node as any)?.type === TYPE;
}