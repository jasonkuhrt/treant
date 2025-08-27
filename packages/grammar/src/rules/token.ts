/**
 * TOKEN rule - defines a token
 */

import type { Rule } from '../rule.js';

export interface TokenRule {
  type: 'TOKEN';
  content: Rule;
}

/**
 * Check if a rule is a TOKEN rule
 */
export function isTokenRule(rule: Rule): rule is TokenRule {
  return rule.type === 'TOKEN';
}