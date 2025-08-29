/**
 * WithMembers rule kind - rules that have members array
 */

import type { Rule } from '../generated/dsl/types.js';
import type { ChoiceRule, SeqRule } from '../generated/dsl/types.js';

/**
 * Rules that have a members array
 */
export type WithMembers = ChoiceRule | SeqRule;

/**
 * Type guard to check if a rule has members
 */
export function isWithMembers(rule: Rule): rule is WithMembers {
  return rule.type === 'CHOICE' || rule.type === 'SEQ';
}
