import type { Node } from 'web-tree-sitter';

const TYPE = 'executable_directive_location' as const;

/**
 * Represents a executable directive location in the graphql AST.
 */
export interface ExecutableDirectiveLocationNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ExecutableDirectiveLocationNode
 */
export function isExecutableDirectiveLocationNode(node: unknown): node is ExecutableDirectiveLocationNode {
  return (node as any)?.type === TYPE;
}