/* eslint-disable @typescript-eslint/no-unused-vars */
/* oxlint-disable */
/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * This re-exports the actual tree-sitter DSL implementation
 * Source: https://github.com/tree-sitter/tree-sitter/blob/master/cli/src/generate/dsl.js
 */

// Import types for proper typing
import type {
  alias as AliasType,
  blank as BlankType,
  choice as ChoiceType,
  field as FieldType,
  optional as OptionalType,
  prec as PrecType,
  repeat as RepeatType,
  repeat1 as Repeat1Type,
  seq as SeqType,
  sym as SymType,
  token as TokenType,
  grammar as GrammarType,
} from './types.js';

// Import the actual tree-sitter DSL implementation
import * as dsl from './dsl-impl.js';

// Re-export all the DSL functions with proper types
export const alias = dsl.alias as unknown as AliasType;
export const blank = dsl.blank as unknown as BlankType;
export const choice = dsl.choice as unknown as ChoiceType;
export const field = dsl.field as unknown as FieldType;
export const optional = dsl.optional as unknown as OptionalType;
export const prec = dsl.prec as unknown as PrecType;
export const repeat = dsl.repeat as unknown as RepeatType;
export const repeat1 = dsl.repeat1 as unknown as Repeat1Type;
export const seq = dsl.seq as unknown as SeqType;
export const sym = dsl.sym as unknown as SymType;
export const token = dsl.token as unknown as TokenType;
export const grammar = dsl.grammar as unknown as GrammarType;