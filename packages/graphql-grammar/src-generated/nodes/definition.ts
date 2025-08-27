import type { Node } from 'web-tree-sitter';
import type { ExecutableDefinition } from './executable_definition.js';
import type { TypeSystemDefinition } from './type_system_definition.js';
import type { TypeSystemExtension } from './type_system_extension.js';

const TYPE = 'definition' as const;

/**
 * Represents a definition in the graphql AST.
 */
export interface Definition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Definition
 */
export function isDefinition(node: unknown): node is Definition {
  return (node as any)?.type === TYPE;
}