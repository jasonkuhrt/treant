// Namespace structure
export * as Analysis from './grammar-analysis.js';
export type { NodeType } from './node-type.js';
export * as RuleKinds from './rule-kinds/$.js';
export * as Rule from './rules/$.js';

// Legacy namespace structure (for backwards compatibility)
export * as Types from './rules/$.js'; // Backwards compatibility alias

// Also export everything directly for flat imports
export * from './grammar-analysis.js';
export * from './grammar-json.js';
export * from './node-type.js';
export * from './rule.js';
export * from './rules/alias.js';
export * from './rules/blank.js';
export * from './rules/choice.js';
export * from './rules/field.js';
export * from './rules/immediate-token.js';
export * from './rules/pattern.js';
export * from './rules/prec-dynamic.js';
export * from './rules/prec-left.js';
export * from './rules/prec-right.js';
export * from './rules/prec.js';
export * from './rules/repeat.js';
export * from './rules/repeat1.js';
export * from './rules/seq.js';
export * from './rules/string.js';
export * from './rules/symbol.js';
export * from './rules/token.js';
// Note: rule-kinds are only exported via Grammar.RuleKinds namespace to avoid naming conflicts
