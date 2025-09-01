import type { Node } from 'web-tree-sitter';
import type { NameNode } from './name.js';

const TYPE = 'alias' as const;

/**
 * Represents a alias in the graphql AST.
 */
export interface AliasNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for AliasNode
 */
export function isAliasNode(node: unknown): node is AliasNode {
  return (node as any)?.type === TYPE;
}