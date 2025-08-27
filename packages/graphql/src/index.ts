import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Parser, Language, Tree } from 'web-tree-sitter';

export * from '@treant/graphql-sdk';

export let parser: Parser | null = null;
export let language: Language | null = null;

/**
 * Initialize the GraphQL parser. This is called automatically on first parse.
 */
export async function initializeParser(): Promise<void> {
  if (parser) return;

  await Parser.init();
  parser = new Parser();

  // Load the WASM binary using require.resolve for better reliability
  const require = createRequire(import.meta.url);
  const wasmPath = require.resolve('@treant/graphql-grammar-wasm');
  const wasmBuffer = readFileSync(wasmPath);
  language = await Language.load(wasmBuffer);
  parser.setLanguage(language);
}

/**
 * Parse GraphQL code into an AST.
 * Automatically initializes the parser on first use.
 *
 * @param code - The GraphQL code to parse
 * @returns The parsed syntax tree
 */
export async function parse(code: string): Promise<Tree> {
  if (!parser) {
    await initializeParser();
  }
  const result = parser!.parse(code);
  if (!result) {
    throw new Error('Failed to parse GraphQL code');
  }
  return result;
}

/**
 * Parse GraphQL code synchronously.
 * Requires initializeParser() to be called first.
 *
 * @param code - The GraphQL code to parse
 * @returns The parsed syntax tree
 * @throws Error if parser not initialized
 */
export function parseSync(code: string): Tree {
  if (!parser) {
    throw new Error('Parser not initialized. Call initializeParser() first or use parse() instead.');
  }
  const result = parser.parse(code);
  if (!result) {
    throw new Error('Failed to parse GraphQL code');
  }
  return result;
}

