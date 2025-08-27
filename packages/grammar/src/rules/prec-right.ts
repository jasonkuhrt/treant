/**
 * PREC_RIGHT rule - right associative precedence
 */

import type { Rule } from '../rule.js';

export interface PrecRightRule {
  type: 'PREC_RIGHT';
  value: number;
  content: Rule;
}

/**
 * Check if a rule is a PREC_RIGHT rule
 */
export function isPrecRightRule(rule: Rule): rule is PrecRightRule {
  return rule.type === 'PREC_RIGHT';
}