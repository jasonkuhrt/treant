/**
 * Prec dynamic rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { PrecDynamicRule } from '../generated/dsl/types.js';

export type { PrecDynamicRule };

export function isPrecDynamicRule(rule: Rule): rule is PrecDynamicRule {
  return rule.type === 'PREC_DYNAMIC';
}