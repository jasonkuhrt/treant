import type { Node } from 'web-tree-sitter';
import type { NameNode } from './name.js';
import type { ValueNode } from './value.js';

const TYPE = 'argument' as const;

/**
 * Represents a argument in the graphql AST.
 */
export interface ArgumentNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ArgumentNode
 */
export function isArgumentNode(node: unknown): node is ArgumentNode {
  return (node as any)?.type === TYPE;
}