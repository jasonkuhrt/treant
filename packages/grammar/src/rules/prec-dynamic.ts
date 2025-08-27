/**
 * PREC_DYNAMIC rule - dynamic precedence
 */

import type { Rule } from '../rule.js';

export interface PrecDynamicRule {
  type: 'PREC_DYNAMIC';
  value: number;
  content: Rule;
}

/**
 * Check if a rule is a PREC_DYNAMIC rule
 */
export function isPrecDynamicRule(rule: Rule): rule is PrecDynamicRule {
  return rule.type === 'PREC_DYNAMIC';
}