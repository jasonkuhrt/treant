/**
 * PREC rule - simple precedence
 */

import type { Rule } from '../rule.js';

export interface PrecRule {
  type: 'PREC';
  value: number;
  content: Rule;
}

/**
 * Check if a rule is a PREC rule
 */
export function isPrecRule(rule: Rule): rule is PrecRule {
  return rule.type === 'PREC';
}