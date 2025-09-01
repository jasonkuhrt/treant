import type { Node } from 'web-tree-sitter';
import type { CommaNode } from './comma.js';
import type { NameNode } from './name.js';
import type { ValueNode } from './value.js';

const TYPE = 'object_field' as const;

/**
 * Represents a object field in the graphql AST.
 */
export interface ObjectFieldNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectFieldNode
 */
export function isObjectFieldNode(node: unknown): node is ObjectFieldNode {
  return (node as any)?.type === TYPE;
}