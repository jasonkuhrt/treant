/**
 * Type definitions for tree-sitter grammar JSON structure.
 * Based on the tree-sitter grammar.json schema.
 */

/**
 * Top-level grammar JSON structure
 */
export interface GrammarJson {
  $schema?: string;
  name: string;
  rules: Record<string, Rule>;
  extras?: Rule[];
  conflicts?: string[][];
  precedences?: Precedence[];
  externals?: Rule[];
  inline?: string[];
  supertypes?: string[];
  word?: string;
}

/**
 * Precedence definition for conflict resolution
 */
export interface Precedence {
  type: string;
  value: number;
}

/**
 * Union type of all possible grammar rules
 */
export type Rule =
  | AliasRule
  | BlankRule
  | ChoiceRule
  | FieldRule
  | ImmediateTokenRule
  | PatternRule
  | PrecDynamicRule
  | PrecLeftRule
  | PrecRightRule
  | PrecRule
  | Repeat1Rule
  | RepeatRule
  | SeqRule
  | StringRule
  | SymbolRule
  | TokenRule;

/**
 * ALIAS rule - gives a node an alternative name
 */
export interface AliasRule {
  type: 'ALIAS';
  content: Rule;
  named: boolean;
  value: string;
}

/**
 * BLANK rule - matches nothing
 */
export interface BlankRule {
  type: 'BLANK';
}

/**
 * CHOICE rule - matches one of several alternatives
 */
export interface ChoiceRule {
  type: 'CHOICE';
  members: Rule[];
}

/**
 * FIELD rule - assigns a field name to a child node
 */
export interface FieldRule {
  type: 'FIELD';
  name: string;
  content: Rule;
}

/**
 * IMMEDIATE_TOKEN rule - token with no whitespace
 */
export interface ImmediateTokenRule {
  type: 'IMMEDIATE_TOKEN';
  content: Rule;
}

/**
 * PATTERN rule - matches a regular expression
 */
export interface PatternRule {
  type: 'PATTERN';
  value: string;
}

/**
 * PREC_DYNAMIC rule - dynamic precedence
 */
export interface PrecDynamicRule {
  type: 'PREC_DYNAMIC';
  value: number;
  content: Rule;
}

/**
 * PREC_LEFT rule - left associative precedence
 */
export interface PrecLeftRule {
  type: 'PREC_LEFT';
  value: number;
  content: Rule;
}

/**
 * PREC_RIGHT rule - right associative precedence
 */
export interface PrecRightRule {
  type: 'PREC_RIGHT';
  value: number;
  content: Rule;
}

/**
 * PREC rule - simple precedence
 */
export interface PrecRule {
  type: 'PREC';
  value: number;
  content: Rule;
}

/**
 * REPEAT1 rule - matches one or more occurrences
 */
export interface Repeat1Rule {
  type: 'REPEAT1';
  content: Rule;
}

/**
 * REPEAT rule - matches zero or more occurrences
 */
export interface RepeatRule {
  type: 'REPEAT';
  content: Rule;
}

/**
 * SEQ rule - matches a sequence of rules
 */
export interface SeqRule {
  type: 'SEQ';
  members: Rule[];
}

/**
 * STRING rule - matches a literal string
 */
export interface StringRule {
  type: 'STRING';
  value: string;
}

/**
 * SYMBOL rule - references another rule by name
 */
export interface SymbolRule {
  type: 'SYMBOL';
  name: string;
}

/**
 * TOKEN rule - defines a token
 */
export interface TokenRule {
  type: 'TOKEN';
  content: Rule;
}

/**
 * Helper type for rules that have members
 */
export type RuleWithMembers = ChoiceRule | SeqRule;

/**
 * Helper type for rules that have content
 */
export type RuleWithContent =
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
 * Helper type for precedence rules
 */
export type PrecedenceRule = PrecRule | PrecDynamicRule | PrecLeftRule | PrecRightRule;

/**
 * All possible rule type strings
 */
export type RuleType = Rule['type'];