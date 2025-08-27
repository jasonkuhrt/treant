/**
 * Tree-sitter grammar JSON type system and utilities.
 * 
 * This namespace provides type-safe access to tree-sitter grammar structure,
 * including types, predicates, and analysis utilities.
 * 
 * @example
 * ```typescript
 * import * as Grammar from './lib/grammar/$.js';
 * 
 * const rule: Grammar.Types.Rule = { type: 'SYMBOL', name: 'identifier' };
 * 
 * if (Grammar.Predicates.isChoiceRule(rule)) {
 *   const symbols = Grammar.Analysis.getSymbolMembers(rule);
 * }
 * ```
 */

export * as Types from './types.js';
export * as Predicates from './predicates.js';
export * as Analysis from './analysis.js';