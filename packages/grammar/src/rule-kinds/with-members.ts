/**
 * WithMembers rule kind - rules that have members array
 */

import type { Rule } from '../rule.js';
import type { Rules } from '../rules/$.js';

/**
 * Rules that have a members array
 */
export type WithMembers = Rules.ChoiceRule | Rules.SeqRule;

/**
 * Type guard to check if a rule has members
 */
export function isWithMembers(rule: Rule): rule is WithMembers {
  return rule.type === 'CHOICE' || rule.type === 'SEQ';
}
