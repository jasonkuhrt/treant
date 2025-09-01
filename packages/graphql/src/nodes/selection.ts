import type { Node } from 'web-tree-sitter';
import type { FieldNode } from './field.js';
import type { FragmentSpreadNode } from './fragment_spread.js';
import type { InlineFragmentNode } from './inline_fragment.js';

const TYPE = 'selection' as const;

/**
 * Represents a selection in the graphql AST.
 */
export interface SelectionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SelectionNode
 */
export function isSelectionNode(node: unknown): node is SelectionNode {
  return (node as any)?.type === TYPE;
}