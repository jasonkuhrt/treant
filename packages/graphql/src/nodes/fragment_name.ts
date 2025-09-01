import type { Node } from 'web-tree-sitter';
import type { NameNode } from './name.js';

const TYPE = 'fragment_name' as const;

/**
 * Represents a fragment name in the graphql AST.
 */
export interface FragmentNameNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FragmentNameNode
 */
export function isFragmentNameNode(node: unknown): node is FragmentNameNode {
  return (node as any)?.type === TYPE;
}