/**
 * Type predicates for tree-sitter grammar rules.
 * These functions provide type-safe runtime checks for rule types.
 */

import type {
  AliasRule,
  BlankRule,
  ChoiceRule,
  FieldRule,
  ImmediateTokenRule,
  PatternRule,
  PrecDynamicRule,
  PrecLeftRule,
  PrecRightRule,
  PrecRule,
  PrecedenceRule,
  Repeat1Rule,
  RepeatRule,
  Rule,
  RuleWithContent,
  RuleWithMembers,
  SeqRule,
  StringRule,
  SymbolRule,
  TokenRule,
} from './types.js';

/**
 * Check if a value is a valid grammar rule
 */
export function isRule(value: unknown): value is Rule {
  return typeof value === 'object' && value !== null && 'type' in value;
}

/**
 * Check if a rule is an ALIAS rule
 */
export function isAliasRule(rule: Rule): rule is AliasRule {
  return rule.type === 'ALIAS';
}

/**
 * Check if a rule is a BLANK rule
 */
export function isBlankRule(rule: Rule): rule is BlankRule {
  return rule.type === 'BLANK';
}

/**
 * Check if a rule is a CHOICE rule
 */
export function isChoiceRule(rule: Rule): rule is ChoiceRule {
  return rule.type === 'CHOICE';
}

/**
 * Check if a rule is a FIELD rule
 */
export function isFieldRule(rule: Rule): rule is FieldRule {
  return rule.type === 'FIELD';
}

/**
 * Check if a rule is an IMMEDIATE_TOKEN rule
 */
export function isImmediateTokenRule(rule: Rule): rule is ImmediateTokenRule {
  return rule.type === 'IMMEDIATE_TOKEN';
}

/**
 * Check if a rule is a PATTERN rule
 */
export function isPatternRule(rule: Rule): rule is PatternRule {
  return rule.type === 'PATTERN';
}

/**
 * Check if a rule is a PREC_DYNAMIC rule
 */
export function isPrecDynamicRule(rule: Rule): rule is PrecDynamicRule {
  return rule.type === 'PREC_DYNAMIC';
}

/**
 * Check if a rule is a PREC_LEFT rule
 */
export function isPrecLeftRule(rule: Rule): rule is PrecLeftRule {
  return rule.type === 'PREC_LEFT';
}

/**
 * Check if a rule is a PREC_RIGHT rule
 */
export function isPrecRightRule(rule: Rule): rule is PrecRightRule {
  return rule.type === 'PREC_RIGHT';
}

/**
 * Check if a rule is a PREC rule
 */
export function isPrecRule(rule: Rule): rule is PrecRule {
  return rule.type === 'PREC';
}

/**
 * Check if a rule is a REPEAT1 rule
 */
export function isRepeat1Rule(rule: Rule): rule is Repeat1Rule {
  return rule.type === 'REPEAT1';
}

/**
 * Check if a rule is a REPEAT rule
 */
export function isRepeatRule(rule: Rule): rule is RepeatRule {
  return rule.type === 'REPEAT';
}

/**
 * Check if a rule is a SEQ rule
 */
export function isSeqRule(rule: Rule): rule is SeqRule {
  return rule.type === 'SEQ';
}

/**
 * Check if a rule is a STRING rule
 */
export function isStringRule(rule: Rule): rule is StringRule {
  return rule.type === 'STRING';
}

/**
 * Check if a rule is a SYMBOL rule
 */
export function isSymbolRule(rule: Rule): rule is SymbolRule {
  return rule.type === 'SYMBOL';
}

/**
 * Check if a rule is a TOKEN rule
 */
export function isTokenRule(rule: Rule): rule is TokenRule {
  return rule.type === 'TOKEN';
}

/**
 * Check if a rule has members (CHOICE or SEQ)
 */
export function hasMembers(rule: Rule): rule is RuleWithMembers {
  return isChoiceRule(rule) || isSeqRule(rule);
}

/**
 * Check if a rule has content
 */
export function hasContent(rule: Rule): rule is RuleWithContent {
  return (
    isAliasRule(rule) ||
    isFieldRule(rule) ||
    isImmediateTokenRule(rule) ||
    isPrecDynamicRule(rule) ||
    isPrecLeftRule(rule) ||
    isPrecRightRule(rule) ||
    isPrecRule(rule) ||
    isRepeat1Rule(rule) ||
    isRepeatRule(rule) ||
    isTokenRule(rule)
  );
}

/**
 * Check if a rule is any precedence rule
 */
export function isPrecedenceRule(rule: Rule): rule is PrecedenceRule {
  return isPrecRule(rule) || isPrecDynamicRule(rule) || isPrecLeftRule(rule) || isPrecRightRule(rule);
}

/**
 * Check if a rule is optional (wrapped in a CHOICE with BLANK)
 */
export function isOptionalRule(rule: Rule): boolean {
  if (!isChoiceRule(rule)) return false;
  return rule.members.some(member => isBlankRule(member)) && rule.members.length === 2;
}

/**
 * Get the non-blank member from an optional rule
 */
export function getOptionalContent(rule: ChoiceRule): Rule | null {
  if (!isOptionalRule(rule)) return null;
  return rule.members.find(member => !isBlankRule(member)) || null;
}