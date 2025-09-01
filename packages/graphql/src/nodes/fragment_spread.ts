import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { FragmentNameNode } from './fragment_name.js';

const TYPE = 'fragment_spread' as const;

/**
 * Represents a fragment spread in the graphql AST.
 */
export interface FragmentSpreadNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FragmentSpreadNode
 */
export function isFragmentSpreadNode(node: unknown): node is FragmentSpreadNode {
  return (node as any)?.type === TYPE;
}