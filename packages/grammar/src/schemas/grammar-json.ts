import { Schema } from 'effect';

// TODO: Generate these schema definitions from TypeScript types in generated/dsl/types.ts
// For now, these manual definitions work fine

// Define all rule type schemas
const AliasRule = Schema.Struct({
  type: Schema.Literal('ALIAS'),
  named: Schema.Boolean,
  content: Schema.suspend(() => Rule),
  value: Schema.String,
});

const BlankRule = Schema.Struct({
  type: Schema.Literal('BLANK'),
});

const ChoiceRule = Schema.Struct({
  type: Schema.Literal('CHOICE'),
  members: Schema.Array(Schema.suspend(() => Rule)),
});

const FieldRule = Schema.Struct({
  type: Schema.Literal('FIELD'),
  name: Schema.String,
  content: Schema.suspend(() => Rule),
});

const ImmediateTokenRule = Schema.Struct({
  type: Schema.Literal('IMMEDIATE_TOKEN'),
  content: Schema.suspend(() => Rule),
});

const PatternRule = Schema.Struct({
  type: Schema.Literal('PATTERN'),
  value: Schema.String,
});

const PrecDynamicRule = Schema.Struct({
  type: Schema.Literal('PREC_DYNAMIC'),
  content: Schema.suspend(() => Rule),
  value: Schema.Number,
});

const PrecLeftRule = Schema.Struct({
  type: Schema.Literal('PREC_LEFT'),
  content: Schema.suspend(() => Rule),
  value: Schema.Union(Schema.String, Schema.Number),
});

const PrecRightRule = Schema.Struct({
  type: Schema.Literal('PREC_RIGHT'),
  content: Schema.suspend(() => Rule),
  value: Schema.Union(Schema.String, Schema.Number),
});

const PrecRule = Schema.Struct({
  type: Schema.Literal('PREC'),
  content: Schema.suspend(() => Rule),
  value: Schema.Union(Schema.String, Schema.Number),
});

const Repeat1Rule = Schema.Struct({
  type: Schema.Literal('REPEAT1'),
  content: Schema.suspend(() => Rule),
});

const RepeatRule = Schema.Struct({
  type: Schema.Literal('REPEAT'),
  content: Schema.suspend(() => Rule),
});

const SeqRule = Schema.Struct({
  type: Schema.Literal('SEQ'),
  members: Schema.Array(Schema.suspend(() => Rule)),
});

const StringRule = Schema.Struct({
  type: Schema.Literal('STRING'),
  value: Schema.String,
});

const SymbolRule = Schema.Struct({
  type: Schema.Literal('SYMBOL'),
  name: Schema.String,
});

const TokenRule = Schema.Struct({
  type: Schema.Literal('TOKEN'),
  content: Schema.suspend(() => Rule),
});

// Union of all rule types
const Rule: Schema.Schema<any> = Schema.Union(
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
  Repeat1Rule,
  RepeatRule,
  SeqRule,
  StringRule,
  SymbolRule,
  TokenRule,
);

// Precedence schema
const Precedence = Schema.Array(
  Schema.Union(
    Rule,
    Schema.Array(Rule),
  ),
);

// Complete GrammarJson schema
export const GrammarJson = Schema.Struct({
  name: Schema.String,
  rules: Schema.Record({ key: Schema.String, value: Rule }),
  extras: Schema.optional(Schema.Array(Rule)),
  conflicts: Schema.optional(Schema.Array(Schema.Array(Schema.String))),
  precedences: Schema.optional(Schema.Array(Precedence)),
  externals: Schema.optional(Schema.Array(Rule)),
  inline: Schema.optional(Schema.Array(Schema.String)),
  supertypes: Schema.optional(Schema.Array(Schema.String)),
  word: Schema.optional(Schema.String),
});

export type GrammarJson = Schema.Schema.Type<typeof GrammarJson>;
