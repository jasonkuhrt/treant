import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { Name } from './name.js';

const TYPE = 'scalar_type_extension' as const;

/**
 * Represents a scalar type extension in the graphql AST.
 */
export interface ScalarTypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ScalarTypeExtension
 */
export function isScalarTypeExtension(node: unknown): node is ScalarTypeExtension {
  return (node as any)?.type === TYPE;
}