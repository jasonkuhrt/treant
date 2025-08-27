/**
 * SEQ rule - matches a sequence of rules
 */

import type { Rule } from '../rule.js';

export interface SeqRule {
  type: 'SEQ';
  members: Rule[];
}

/**
 * Check if a rule is a SEQ rule
 */
export function isSeqRule(rule: Rule): rule is SeqRule {
  return rule.type === 'SEQ';
}