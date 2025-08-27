import type { Node } from 'web-tree-sitter';

const TYPE = 'comment' as const;

/**
 * Represents a comment in the graphql AST.
 */
export interface Comment extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Comment
 */
export function isComment(node: unknown): node is Comment {
  return (node as any)?.type === TYPE;
}