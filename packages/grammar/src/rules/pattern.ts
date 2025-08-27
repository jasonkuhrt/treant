/**
 * PATTERN rule - matches a regular expression
 */

import type { Rule } from '../rule.js';

export interface PatternRule {
  type: 'PATTERN';
  value: string;
}

/**
 * Check if a rule is a PATTERN rule
 */
export function isPatternRule(rule: Rule): rule is PatternRule {
  return rule.type === 'PATTERN';
}