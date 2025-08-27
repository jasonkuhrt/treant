/**
 * ALIAS rule - gives a node an alternative name
 */

import type { Rule } from '../rule.js';

export interface AliasRule {
  type: 'ALIAS';
  content: Rule;
  named: boolean;
  value: string;
}

/**
 * Check if a rule is an ALIAS rule
 */
export function isAliasRule(rule: Rule): rule is AliasRule {
  return rule.type === 'ALIAS';
}