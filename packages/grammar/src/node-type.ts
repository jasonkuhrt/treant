/**
 * Type definitions for node-types.json structure
 */

/**
 * Node type definition from tree-sitter node-types.json
 */
export interface NodeType {
  type: string;
  named: boolean;
  fields?: Record<string, unknown>;
  children?: {
    multiple: boolean;
    required: boolean;
    types: Array<{ type: string; named: boolean }>;
  };
  extra?: boolean;
  root?: boolean;
}