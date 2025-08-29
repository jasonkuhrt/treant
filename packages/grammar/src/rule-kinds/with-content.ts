/**
 * WithContent rule kind - rules that have content property
 */

import type { Rule } from '../generated/dsl/types.js';
import type { 
  AliasRule,
  FieldRule,
  ImmediateTokenRule,
  PrecDynamicRule,
  PrecLeftRule,
  PrecRightRule,
  PrecRule,
  Repeat1Rule,
  RepeatRule,
  TokenRule
} from '../generated/dsl/types.js';

/**
 * Rules that have a content property
 */
export type WithContent =
  | AliasRule
  | FieldRule
  | ImmediateTokenRule
  | PrecDynamicRule
  | PrecLeftRule
  | PrecRightRule
  | PrecRule
  | Repeat1Rule
  | RepeatRule
  | TokenRule;

/**
 * Check if a rule has content
 */
export function isWithContent(rule: Rule): rule is WithContent {
  return (
    rule.type === 'ALIAS'
    || rule.type === 'FIELD'
    || rule.type === 'IMMEDIATE_TOKEN'
    || rule.type === 'PREC_DYNAMIC'
    || rule.type === 'PREC_LEFT'
    || rule.type === 'PREC_RIGHT'
    || rule.type === 'PREC'
    || rule.type === 'REPEAT1'
    || rule.type === 'REPEAT'
    || rule.type === 'TOKEN'
  );
}
