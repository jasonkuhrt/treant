import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { SelectionSet } from './selection_set.js';
import type { TypeCondition } from './type_condition.js';

const TYPE = 'inline_fragment' as const;

/**
 * Represents a inline fragment in the graphql AST.
 */
export interface InlineFragment extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InlineFragment
 */
export function isInlineFragment(node: unknown): node is InlineFragment {
  return (node as any)?.type === TYPE;
}