/**
 * Symbol rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { SymbolRule } from '../generated/dsl/types.js';

export type { SymbolRule };

export function isSymbolRule(rule: Rule): rule is SymbolRule<string> {
  return rule.type === 'SYMBOL';
}