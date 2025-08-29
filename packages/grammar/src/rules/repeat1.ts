/**
 * Repeat1 rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { Repeat1Rule } from '../generated/dsl/types.js';

export type { Repeat1Rule };

export function isRepeat1Rule(rule: Rule): rule is Repeat1Rule {
  return rule.type === 'REPEAT1';
}