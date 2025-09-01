import type { Node } from 'web-tree-sitter';
import type { ArgumentNode } from './argument.js';

const TYPE = 'arguments' as const;

/**
 * Represents a arguments in the graphql AST.
 */
export interface ArgumentsNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ArgumentsNode
 */
export function isArgumentsNode(node: unknown): node is ArgumentsNode {
  return (node as any)?.type === TYPE;
}