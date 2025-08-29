/**
 * Optional rule kind - rules that represent optional content
 */

import type { Rule } from '../generated/dsl/types.js';
import type { ChoiceRule } from '../generated/dsl/types.js';

/**
 * Rules that represent optional content (CHOICE with BLANK)
 */
export type Optional = ChoiceRule;

/**
 * Check if a rule is optional (wrapped in a CHOICE with BLANK)
 */
export function isOptional(rule: Rule): boolean {
  if (rule.type !== 'CHOICE') return false;
  const choiceRule = rule as ChoiceRule;
  return choiceRule.members.some(member => member.type === 'BLANK') && choiceRule.members.length === 2;
}

/**
 * Get the non-blank member from an optional rule
 */
export function getOptionalContent(rule: ChoiceRule): Rule | null {
  if (!isOptional(rule)) return null;
  return rule.members.find(member => member.type !== 'BLANK') || null;
}
