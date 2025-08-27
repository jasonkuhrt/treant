/**
 * TypeScript syntax construction utilities.
 *
 * This namespace provides utilities for generating TypeScript code
 * programmatically, including naming conventions, import/export statements,
 * type declarations, and tree-sitter specific helpers.
 *
 * @example
 * ```typescript
 * import * as TS from './lib/ts-syntax/$.js';
 *
 * const interfaceName = TS.getNodeInterfaceName('field_definition');
 * const guardName = TS.getTypeGuardName('field_definition');
 *
 * const unionType = TS.unionType(['Field', 'Fragment', 'Operation']);
 * ```
 */

export * from './ts-syntax.js';
