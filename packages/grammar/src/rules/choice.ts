/**
 * CHOICE rule - matches one of several alternatives
 */

import type { Rule } from '../rule.js';

export interface ChoiceRule {
  type: 'CHOICE';
  members: Rule[];
}

/**
 * Check if a rule is a CHOICE rule
 */
export function isChoiceRule(rule: Rule): rule is ChoiceRule {
  return rule.type === 'CHOICE';
}