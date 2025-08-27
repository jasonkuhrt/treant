import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import Parser, { Language, Tree } from 'web-tree-sitter';

// Re-export everything from the SDK
export * from '@treant/graphql-sdk';
export * as TreeSitterGraphQL from '@treant/graphql-sdk';

let parserInstance: Parser | null = null;
let languageInstance: Language | null = null;

/**
 * Initialize the GraphQL parser. This is called automatically on first parse.
 */
export async function initializeParser(): Promise<void> {
  if (parserInstance) return;

  await Parser.init();
  parserInstance = new Parser();

  // Load the WASM binary using require.resolve for better reliability
  const require = createRequire(import.meta.url);
  const wasmPath = require.resolve('@treant/graphql-grammar-wasm');
  const wasmBuffer = readFileSync(wasmPath);
  languageInstance = await Language.load(wasmBuffer);
  parserInstance.setLanguage(languageInstance);
}

/**
 * Parse GraphQL code into an AST.
 * Automatically initializes the parser on first use.
 *
 * @param code - The GraphQL code to parse
 * @returns The parsed syntax tree
 */
export async function parse(code: string): Promise<Tree> {
  if (!parserInstance) {
    await initializeParser();
  }
  return parserInstance!.parse(code);
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
  if (!parserInstance) {
    throw new Error('Parser not initialized. Call initializeParser() first or use parse() instead.');
  }
  return parserInstance.parse(code);
}

/**
 * Get the parser instance.
 * Useful for advanced use cases.
 *
 * @returns The parser instance or null if not initialized
 */
export function getParser(): Parser | null {
  return parserInstance;
}

/**
 * Get the GraphQL language instance.
 * Useful for advanced use cases.
 *
 * @returns The language instance or null if not initialized
 */
export function getLanguage(): Language | null {
  return languageInstance;
}
