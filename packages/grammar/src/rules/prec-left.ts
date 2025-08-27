/**
 * PREC_LEFT rule - left associative precedence
 */

import type { Rule } from '../rule.js';

export interface PrecLeftRule {
  type: 'PREC_LEFT';
  value: number;
  content: Rule;
}

/**
 * Check if a rule is a PREC_LEFT rule
 */
export function isPrecLeftRule(rule: Rule): rule is PrecLeftRule {
  return rule.type === 'PREC_LEFT';
}