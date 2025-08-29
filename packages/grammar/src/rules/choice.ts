/**
 * Choice rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { ChoiceRule } from '../generated/dsl/types.js';

export type { ChoiceRule };

export function isChoiceRule(rule: Rule): rule is ChoiceRule {
  return rule.type === 'CHOICE';
}