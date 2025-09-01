import type { Node } from 'web-tree-sitter';
import type { NameNode } from './name.js';

const TYPE = 'enum_value' as const;

/**
 * Represents a enum value in the graphql AST.
 */
export interface EnumValueNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for EnumValueNode
 */
export function isEnumValueNode(node: unknown): node is EnumValueNode {
  return (node as any)?.type === TYPE;
}