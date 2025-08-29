/**
 * Prec rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { PrecRule } from '../generated/dsl/types.js';

export type { PrecRule };

export function isPrecRule(rule: Rule): rule is PrecRule {
  return rule.type === 'PREC';
}