import type { Node } from 'web-tree-sitter';
import type { DirectiveLocationNode } from './directive_location.js';

const TYPE = 'directive_locations' as const;

/**
 * Represents a directive locations in the graphql AST.
 */
export interface DirectiveLocationsNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveLocationsNode
 */
export function isDirectiveLocationsNode(node: unknown): node is DirectiveLocationsNode {
  return (node as any)?.type === TYPE;
}