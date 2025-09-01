import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { SelectionSetNode } from './selection_set.js';
import type { TypeConditionNode } from './type_condition.js';

const TYPE = 'inline_fragment' as const;

/**
 * Represents a inline fragment in the graphql AST.
 */
export interface InlineFragmentNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InlineFragmentNode
 */
export function isInlineFragmentNode(node: unknown): node is InlineFragmentNode {
  return (node as any)?.type === TYPE;
}