/**
 * Optional rule kind - rules that represent optional content
 */

import type { Rules } from '../rules/$.js';
import type { Rule } from '../rule.js';

/**
 * Rules that represent optional content (CHOICE with BLANK)
 */
export type Optional = Rules.ChoiceRule;

/**
 * Check if a rule is optional (wrapped in a CHOICE with BLANK)
 */
export function isOptional(rule: Rule): boolean {
  if (rule.type !== 'CHOICE') return false;
  const choiceRule = rule as Rules.ChoiceRule;
  return choiceRule.members.some(member => member.type === 'BLANK') && choiceRule.members.length === 2;
}

/**
 * Get the non-blank member from an optional rule
 */
export function getOptionalContent(rule: Rules.ChoiceRule): Rule | null {
  if (!isOptional(rule)) return null;
  return rule.members.find(member => member.type !== 'BLANK') || null;
}