/**
 * Prec left rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { PrecLeftRule } from '../generated/dsl/types.js';

export type { PrecLeftRule };

export function isPrecLeftRule(rule: Rule): rule is PrecLeftRule {
  return rule.type === 'PREC_LEFT';
}