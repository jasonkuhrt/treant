/**
 * Precedence rule kind - rules that handle precedence
 */

import type { Rule } from '../generated/dsl/types.js';
import type { PrecRule, PrecDynamicRule, PrecLeftRule, PrecRightRule } from '../generated/dsl/types.js';

/**
 * Rules that handle precedence
 */
export type Precedence =
  | PrecRule
  | PrecDynamicRule
  | PrecLeftRule
  | PrecRightRule;

/**
 * Type guard to check if a rule is a precedence rule
 */
export function isPrecedence(rule: Rule): rule is Precedence {
  return rule.type === 'PREC'
    || rule.type === 'PREC_DYNAMIC'
    || rule.type === 'PREC_LEFT'
    || rule.type === 'PREC_RIGHT';
}
