import type { Node } from 'web-tree-sitter';
import type { ArgumentsDefinitionNode } from './arguments_definition.js';
import type { DescriptionNode } from './description.js';
import type { DirectiveLocationsNode } from './directive_locations.js';
import type { NameNode } from './name.js';

const TYPE = 'directive_definition' as const;

/**
 * Represents a directive definition in the graphql AST.
 */
export interface DirectiveDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveDefinitionNode
 */
export function isDirectiveDefinitionNode(node: unknown): node is DirectiveDefinitionNode {
  return (node as any)?.type === TYPE;
}