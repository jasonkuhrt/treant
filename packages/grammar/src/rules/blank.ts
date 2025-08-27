/**
 * BLANK rule - matches nothing
 */

import type { Rule } from '../rule.js';

export interface BlankRule {
  type: 'BLANK';
}

/**
 * Check if a rule is a BLANK rule
 */
export function isBlankRule(rule: Rule): rule is BlankRule {
  return rule.type === 'BLANK';
}