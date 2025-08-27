import type { Node } from 'web-tree-sitter';
import type { Name } from './name.js';

const TYPE = 'named_type' as const;

/**
 * Represents a named type in the graphql AST.
 */
export interface NamedType extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NamedType
 */
export function isNamedType(node: unknown): node is NamedType {
  return (node as any)?.type === TYPE;
}