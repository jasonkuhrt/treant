import type { Node } from 'web-tree-sitter';
import type { NamedType } from './named_type.js';

const TYPE = 'implements_interfaces' as const;

/**
 * Represents a implements interfaces in the graphql AST.
 */
export interface ImplementsInterfaces extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ImplementsInterfaces
 */
export function isImplementsInterfaces(node: unknown): node is ImplementsInterfaces {
  return (node as any)?.type === TYPE;
}