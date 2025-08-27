/**
 * STRING rule - matches a literal string
 */

import type { Rule } from '../rule.js';

export interface StringRule {
  type: 'STRING';
  value: string;
}

/**
 * Check if a rule is a STRING rule
 */
export function isStringRule(rule: Rule): rule is StringRule {
  return rule.type === 'STRING';
}