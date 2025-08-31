# @treant/generator-sdk

This is a TypeScript SDK generator for Tree Sitter gramamrs.

Tree Sitter is a Rust-based toolkit for building parsers for programming languages. It includes a DSL for defining grammars and a runtime library for parsing code based on those grammars.

The central idea behind this generator is that all the rules already defined in the grammar provide all the semantics we need to also have an library whose interface exactly restricts traversal and manipulation to what is actually possible in an AST comforming to the grammar.

So this generator runs against those grammars to emit code that makes it easy to navigate and manipulate the ASTs produced by Tree Sitter parsers. You receive a delightfully ergonomic chaining API that is made type safe thanks to its TypeScript typings.

## Usage

todo

## Tree Sitter Grammar Rule Types

[Official docs](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)

### seq

#### About

> The `seq` function creates a rule that matches any number of other rules, one after another. It is analogous to simple concatenation in [EBNF notation](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form).

#### Interface Effect

The SEQ pattern generates a navigator interface with one method per named child element. Required children return non-nullable navigators, while optional children (wrapped in CHOICE with BLANK) return nullable navigators. Anonymous strings in the sequence are ignored. For example, a field definition SEQ with `[optional($.description), $.name, ':', $.type]` generates:

- `description(): DescriptionNavigator | null` (optional)
- `name(): NameNavigator` (required)
- `type(): TypeNavigator` (required)
- No method for ':' (anonymous string)

### choice

#### About

> The `choice` function creates a rule that matches _one_ of a set of possible rules. The order of the arguments does not matter. This is analogous to the `|` (pipe) operator in [EBNF notation](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form).

#### Interface Effect

todo

### repeat and repeat1

#### About

> The `repeat` function creates a rule that matches _zero-or-more_ occurrences of a given rule. It is analogous to the `*` (star) operator in [EBNF notation](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form).
>
> The `repeat1` function creates a rule that matches _one-or-more_ occurrences of a given rule. The `repeat1(rule)` function is equivalent to `seq(rule, repeat(rule))`.

#### Interface Effect

todo

### optional

#### About

> The `optional` function creates a rule that matches _zero or one_ occurrence of a given rule. It is analogous to the `?` (question mark) operator in [EBNF notation](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form).

#### Interface Effect

todo

### field

#### About

> The `field` function assigns a _field name_ to a child node. Fields allow you to refer to specific nodes in a syntax tree by name, rather than by their position in the tree.

#### Interface Effect

todo

### alias

#### About

> The `alias` function causes a node to appear in the syntax tree under a different name. This is useful when you want to reuse a rule in multiple places, but you want to distinguish between the different uses.

#### Interface Effect

todo

### token

#### About

> The `token` function marks a rule as producing a single _token_. Tree-sitter's default is to treat each string or regex literal in the grammar as a separate token. The `token` function allows you to express a complex rule using the functions described above (rather than as a single regular expression) but still have Tree-sitter treat it as a single token.

#### Interface Effect

todo

### prec, prec.left, prec.right, prec.dynamic

#### About

> The `prec` function marks a rule with a _precedence_ level. This is used to resolve ambiguities in the grammar. The `prec.left` and `prec.right` functions are used to specify associativity. The `prec.dynamic` function is similar to `prec`, but it is used for precedences that are applied at runtime.

#### Interface Effect

todo
