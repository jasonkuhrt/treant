/**
 * IMMEDIATE_TOKEN rule - token with no whitespace
 */

import type { Rule } from '../rule.js';

export interface ImmediateTokenRule {
  type: 'IMMEDIATE_TOKEN';
  content: Rule;
}

/**
 * Check if a rule is an IMMEDIATE_TOKEN rule
 */
export function isImmediateTokenRule(rule: Rule): rule is ImmediateTokenRule {
  return rule.type === 'IMMEDIATE_TOKEN';
}