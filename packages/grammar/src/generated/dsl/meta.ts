/**
 * DSL function names exported from tree-sitter-cli/dsl
 */
export const dslFunctions = [
  'grammar',
  'seq',
  'choice',
  'repeat',
  'repeat1',
  'optional',
  'field',
  'alias',
  'token',
  'prec',
  'blank',
  'sym'
] as const

export type DslFunction = typeof dslFunctions[number]