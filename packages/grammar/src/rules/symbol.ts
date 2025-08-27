/**
 * SYMBOL rule - references another rule by name
 */

import type { Rule } from '../rule.js';

export interface SymbolRule {
  type: 'SYMBOL';
  name: string;
}

/**
 * Check if a rule is a SYMBOL rule
 */
export function isSymbolRule(rule: Rule): rule is SymbolRule {
  return rule.type === 'SYMBOL';
}