// Import for type reference
import type { AliasRule } from './rules/alias.js';
import type { BlankRule } from './rules/blank.js';
import type { ChoiceRule } from './rules/choice.js';
import type { FieldRule } from './rules/field.js';
import type { ImmediateTokenRule } from './rules/immediate-token.js';
import type { PatternRule } from './rules/pattern.js';
import type { PrecDynamicRule } from './rules/prec-dynamic.js';
import type { PrecLeftRule } from './rules/prec-left.js';
import type { PrecRightRule } from './rules/prec-right.js';
import type { PrecRule } from './rules/prec.js';
import type { RepeatRule } from './rules/repeat.js';
import type { Repeat1Rule } from './rules/repeat1.js';
import type { SeqRule } from './rules/seq.js';
import type { StringRule } from './rules/string.js';
import type { SymbolRule } from './rules/symbol.js';
import type { TokenRule } from './rules/token.js';

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
 * All possible rule type strings
 */
export type RuleType = Rule['type'];
