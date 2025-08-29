/**
 * Prec right rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { PrecRightRule } from '../generated/dsl/types.js';

export type { PrecRightRule };

export function isPrecRightRule(rule: Rule): rule is PrecRightRule {
  return rule.type === 'PREC_RIGHT';
}