import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';

const TYPE = 'scalar_type_definition' as const;

/**
 * Represents a scalar type definition in the graphql AST.
 */
export interface ScalarTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ScalarTypeDefinitionNode
 */
export function isScalarTypeDefinitionNode(node: unknown): node is ScalarTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}