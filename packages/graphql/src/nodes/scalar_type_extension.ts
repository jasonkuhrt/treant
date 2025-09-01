import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';

const TYPE = 'scalar_type_extension' as const;

/**
 * Represents a scalar type extension in the graphql AST.
 */
export interface ScalarTypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ScalarTypeExtensionNode
 */
export function isScalarTypeExtensionNode(node: unknown): node is ScalarTypeExtensionNode {
  return (node as any)?.type === TYPE;
}