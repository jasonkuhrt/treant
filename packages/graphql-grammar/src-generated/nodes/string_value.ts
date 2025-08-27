import type { Node } from 'web-tree-sitter';

const TYPE = 'string_value' as const;

/**
 * Represents a string value in the graphql AST.
 */
export interface StringValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for StringValue
 */
export function isStringValue(node: unknown): node is StringValue {
  return (node as any)?.type === TYPE;
}