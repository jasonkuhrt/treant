import type { Node } from 'web-tree-sitter';
import type { AliasNode } from './alias.js';
import type { ArgumentsNode } from './arguments.js';
import type { DirectiveNode } from './directive.js';
import type { NameNode } from './name.js';
import type { SelectionSetNode } from './selection_set.js';

const TYPE = 'field' as const;

/**
 * Represents a field in the graphql AST.
 */
export interface FieldNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FieldNode
 */
export function isFieldNode(node: unknown): node is FieldNode {
  return (node as any)?.type === TYPE;
}