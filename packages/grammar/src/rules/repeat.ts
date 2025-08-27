/**
 * REPEAT rule - matches zero or more occurrences
 */

import type { Rule } from '../rule.js';

export interface RepeatRule {
  type: 'REPEAT';
  content: Rule;
}

/**
 * Check if a rule is a REPEAT rule
 */
export function isRepeatRule(rule: Rule): rule is RepeatRule {
  return rule.type === 'REPEAT';
}