import type { Node } from 'web-tree-sitter';
import type { ArgumentsDefinition } from './arguments_definition.js';
import type { Description } from './description.js';
import type { DirectiveLocations } from './directive_locations.js';
import type { Name } from './name.js';

const TYPE = 'directive_definition' as const;

/**
 * Represents a directive definition in the graphql AST.
 */
export interface DirectiveDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveDefinition
 */
export function isDirectiveDefinition(node: unknown): node is DirectiveDefinition {
  return (node as any)?.type === TYPE;
}