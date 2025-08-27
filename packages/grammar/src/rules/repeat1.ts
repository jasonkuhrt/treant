/**
 * REPEAT1 rule - matches one or more occurrences
 */

import type { Rule } from '../rule.js';

export interface Repeat1Rule {
  type: 'REPEAT1';
  content: Rule;
}

/**
 * Check if a rule is a REPEAT1 rule
 */
export function isRepeat1Rule(rule: Rule): rule is Repeat1Rule {
  return rule.type === 'REPEAT1';
}