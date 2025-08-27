import { createRequire } from 'node:module';

/**
 * Get the path to the GraphQL grammar WASM file.
 * Useful for manual parser setup.
 *
 * @returns Absolute path to the WASM file
 */
export function getWasmPath(): string {
  const require = createRequire(import.meta.url);
  return require.resolve('@treant/graphql-grammar-wasm');
}
