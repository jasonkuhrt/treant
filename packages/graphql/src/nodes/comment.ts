import type { Node } from 'web-tree-sitter';

const TYPE = 'comment' as const;

/**
 * Represents a comment in the graphql AST.
 */
export interface CommentNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for CommentNode
 */
export function isCommentNode(node: unknown): node is CommentNode {
  return (node as any)?.type === TYPE;
}