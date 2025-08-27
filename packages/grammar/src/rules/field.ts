/**
 * FIELD rule - assigns a field name to a child node
 */

import type { Rule } from '../rule.js';

export interface FieldRule {
  type: 'FIELD';
  name: string;
  content: Rule;
}

/**
 * Check if a rule is a FIELD rule
 */
export function isFieldRule(rule: Rule): rule is FieldRule {
  return rule.type === 'FIELD';
}