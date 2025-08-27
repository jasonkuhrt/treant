import type { Node } from 'web-tree-sitter';

const TYPE = 'executable_directive_location' as const;

/**
 * Represents a executable directive location in the graphql AST.
 */
export interface ExecutableDirectiveLocation extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ExecutableDirectiveLocation
 */
export function isExecutableDirectiveLocation(node: unknown): node is ExecutableDirectiveLocation {
  return (node as any)?.type === TYPE;
}