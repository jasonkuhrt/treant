import type { Grammar } from '../../generated/dsl/types.js'
import { dslFunctions } from '../../generated/dsl/meta.js'

/**
 * Convert a Grammar object to tree-sitter grammar.js source code.
 * Generates ESM format with proper imports from tree-sitter-cli/dsl.
 */
export const grammarToSourceCode = <RuleName extends string>(grammar: Grammar<RuleName>): string => {
  const parts: string[] = [`  name: "${grammar.name}"`]
  
  // Convert rules - need to handle function toString properly
  const rulesStr = Object.entries(grammar.rules as Record<string, Function>)
    .map(([name, fn]) => {
      // Convert function to string and replace Grammar.Rules.X or Grammar.X with just X
      let fnStr = fn.toString();
      // Create regex pattern from the dsl functions array
      const pattern = new RegExp(`Grammar\\.(Rules\\.)?(${dslFunctions.join('|')})`, 'g');
      fnStr = fnStr.replace(pattern, '$2');
      return `    ${name}: ${fnStr}`;
    })
    .join(',\n');
  
  parts.push(`  rules: {\n${rulesStr}\n  }`)
  
  // Add optional fields
  if (grammar.extras) {
    parts.push(`  extras: ${grammar.extras.toString()}`)
  }
  if (grammar.conflicts) {
    parts.push(`  conflicts: ${grammar.conflicts.toString()}`)
  }
  if (grammar.precedences) {
    parts.push(`  precedences: ${grammar.precedences.toString()}`)
  }
  if (grammar.externals) {
    parts.push(`  externals: ${grammar.externals.toString()}`)
  }
  if (grammar.inline) {
    parts.push(`  inline: ${grammar.inline.toString()}`)
  }
  if (grammar.supertypes) {
    parts.push(`  supertypes: ${grammar.supertypes.toString()}`)
  }
  if (grammar.word) {
    parts.push(`  word: ${grammar.word.toString()}`)
  }
  
  // Tree-sitter provides DSL functions as globals when evaluating the grammar
  // No imports needed - just export the grammar call
  return `export default grammar({
${parts.join(',\n')}
});`
}

export * as GrammarToSourceCode from './$.js'