import type { Node } from 'web-tree-sitter';
import type { ArgumentsNode } from './arguments.js';
import type { NameNode } from './name.js';

const TYPE = 'directive' as const;

/**
 * Represents a directive in the graphql AST.
 */
export interface DirectiveNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveNode
 */
export function isDirectiveNode(node: unknown): node is DirectiveNode {
  return (node as any)?.type === TYPE;
}