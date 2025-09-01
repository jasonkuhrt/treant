/**
 * Parser utilities for graphql
 * @generated
 */

import { Parser, Language } from 'web-tree-sitter';
import type { Tree } from 'web-tree-sitter';

/**
 * Create and initialize a parser for graphql.
 * Automatically loads the WASM grammar.
 */
export async function create(): Promise<Parser> {
  // Initialize the Parser library once
  await Parser.init();

  // Create a new parser instance
  const parser = new Parser();

  // Load the WASM grammar
  const wasmUrl = new URL('../grammar-build/grammar.wasm', import.meta.url);
  // Use pathname for Node.js (file://) or href for browser (http://)
  const wasmPath = wasmUrl.protocol === 'file:' ? wasmUrl.pathname : wasmUrl.href;
  const language = await Language.load(wasmPath);

  // Set the language on the parser
  parser.setLanguage(language);

  return parser;
}

/**
 * Parse source code and return the syntax tree.
 */
export async function parse(sourceCode: string): Promise<Tree> {
  const parser = await create();
  const tree = parser.parse(sourceCode);
  if (!tree) {
    throw new Error('Failed to parse source code');
  }
  return tree;
}
