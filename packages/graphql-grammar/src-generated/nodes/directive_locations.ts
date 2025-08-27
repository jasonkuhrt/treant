import type { Node } from 'web-tree-sitter';
import type { DirectiveLocation } from './directive_location.js';

const TYPE = 'directive_locations' as const;

/**
 * Represents a directive locations in the graphql AST.
 */
export interface DirectiveLocations extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveLocations
 */
export function isDirectiveLocations(node: unknown): node is DirectiveLocations {
  return (node as any)?.type === TYPE;
}