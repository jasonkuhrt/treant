import type { Node } from 'web-tree-sitter';
import type { NamedTypeNode } from './named_type.js';

const TYPE = 'implements_interfaces' as const;

/**
 * Represents a implements interfaces in the graphql AST.
 */
export interface ImplementsInterfacesNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ImplementsInterfacesNode
 */
export function isImplementsInterfacesNode(node: unknown): node is ImplementsInterfacesNode {
  return (node as any)?.type === TYPE;
}