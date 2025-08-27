import type { Node } from 'web-tree-sitter';
import type { ExecutableDirectiveLocation } from './executable_directive_location.js';
import type { TypeSystemDirectiveLocation } from './type_system_directive_location.js';

const TYPE = 'directive_location' as const;

/**
 * Represents a directive location in the graphql AST.
 */
export interface DirectiveLocation extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveLocation
 */
export function isDirectiveLocation(node: unknown): node is DirectiveLocation {
  return (node as any)?.type === TYPE;
}