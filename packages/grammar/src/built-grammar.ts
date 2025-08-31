import type { GrammarJson } from './schemas/grammar-json.js';
import type { NodeType } from './schemas/node-type.js';

/**
 * Represents a built/compiled grammar with all its artifacts.
 * This is the output of tree-sitter's grammar generation process.
 */
export interface BuiltGrammar {
  /**
   * The parsed grammar.json file containing the grammar rules and structure.
   */
  grammar: GrammarJson;
  
  /**
   * The parsed node-types.json file containing node type definitions.
   */
  nodeTypes: readonly NodeType[];
  
  /**
   * Optional WASM binary for runtime parsing.
   */
  wasm?: Uint8Array;
}