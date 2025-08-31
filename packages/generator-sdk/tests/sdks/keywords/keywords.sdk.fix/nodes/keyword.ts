import type { Node } from 'web-tree-sitter';

const TYPE = 'keyword' as const;

/**
 * Represents a keyword in the keywords AST.
 */
export interface KeywordNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for KeywordNode
 */
export function isKeywordNode(node: unknown): node is KeywordNode {
  return (node as any)?.type === TYPE;
}