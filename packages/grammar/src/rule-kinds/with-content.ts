/**
 * WithContent rule kind - rules that have content property
 */

import type { Rule } from '../rule.js';
import { Rules } from '../rules/$.js';

/**
 * Rules that have a content property
 */
export type WithContent =
  | Rules.AliasRule
  | Rules.FieldRule
  | Rules.ImmediateTokenRule
  | Rules.PrecDynamicRule
  | Rules.PrecLeftRule
  | Rules.PrecRightRule
  | Rules.PrecRule
  | Rules.Repeat1Rule
  | Rules.RepeatRule
  | Rules.TokenRule;

/**
 * Check if a rule has content
 */
export function isWithContent(rule: Rule): rule is WithContent {
  return (
    Rules.isAliasRule(rule)
    || Rules.isFieldRule(rule)
    || Rules.isImmediateTokenRule(rule)
    || Rules.isPrecDynamicRule(rule)
    || Rules.isPrecLeftRule(rule)
    || Rules.isPrecRightRule(rule)
    || Rules.isPrecRule(rule)
    || Rules.isRepeat1Rule(rule)
    || Rules.isRepeatRule(rule)
    || Rules.isTokenRule(rule)
  );
}
