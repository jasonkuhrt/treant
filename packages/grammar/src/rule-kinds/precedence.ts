/**
 * Precedence rule kind - rules that handle precedence
 */

import type { Rule } from '../rule.js';
import type { Rules } from '../rules/$.js';

/**
 * Rules that handle precedence
 */
export type Precedence =
  | Rules.PrecRule
  | Rules.PrecDynamicRule
  | Rules.PrecLeftRule
  | Rules.PrecRightRule;

/**
 * Type guard to check if a rule is a precedence rule
 */
export function isPrecedence(rule: Rule): rule is Precedence {
  return rule.type === 'PREC'
    || rule.type === 'PREC_DYNAMIC'
    || rule.type === 'PREC_LEFT'
    || rule.type === 'PREC_RIGHT';
}
