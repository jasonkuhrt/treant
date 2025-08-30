import { Effect, Scope } from 'effect'
import * as FileSystem from '@effect/platform/FileSystem'
import * as Command from '@effect/platform/Command'
import * as CommandExecutor from '@effect/platform/CommandExecutor'
import * as PlatformError from '@effect/platform/Error'
import * as NodeContext from '@effect/platform-node/NodeContext'
import type { Grammar } from './generated/dsl/types.js'
import type { GrammarJson } from './grammar-json.js'
import type { NodeType } from './node-type.js'

export interface GenerateOutput {
  files: {
    grammarJson: string
    nodeTypes: string
    parserC: string
    headers?: {
      parserH: string
      allocH: string
      arrayH: string
    } | undefined
  }
  parsed: {
    grammar: GrammarJson
    nodeTypes: NodeType[]
  }
}

export class GenerateError extends Error {
  readonly _tag = 'GenerateError'
  constructor(message: string, cause?: unknown) {
    super(message, { cause })
    this.name = 'GenerateError'
  }
}

// Serialize grammar object to grammar.js string
const serializeGrammar = <RuleName extends string>(grammar: Grammar<RuleName>): string => {
  const parts: string[] = [`  name: "${grammar.name}"`]
  
  // Serialize rules
  parts.push(`  rules: {
${Object.entries(grammar.rules as Record<string, Function>)
    .map(([name, fn]) => `    ${name}: ${fn.toString()}`)
    .join(',\n')}
  }`)
  
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
  
  return `export default grammar({
${parts.join(',\n')}
})`
}

// Create temp directory with automatic cleanup
const withTempDirectory = <A, E, R>(
  f: (tempDir: string) => Effect.Effect<A, E, R>
): Effect.Effect<A, E | GenerateError | PlatformError.PlatformError, R | FileSystem.FileSystem | Scope.Scope> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const tempDir = yield* fs.makeTempDirectory({ prefix: 'treant-grammar-' })
    
    const cleanup = () => fs.remove(tempDir, { recursive: true }).pipe(
      Effect.catchAll(() => Effect.succeed(undefined))
    )
    
    return yield* Effect.acquireUseRelease(
      Effect.succeed(tempDir),
      f,
      cleanup
    )
  })

// Main implementation with temp directory
export const generate = <RuleName extends string>(
  grammar: Grammar<RuleName>
): Effect.Effect<GenerateOutput, GenerateError | PlatformError.PlatformError, FileSystem.FileSystem | CommandExecutor.CommandExecutor | Scope.Scope> =>
  withTempDirectory((tempDir) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      
      // Write grammar.js
      const grammarJs = serializeGrammar(grammar)
      yield* fs.writeFileString(`${tempDir}/grammar.js`, grammarJs)
      
      // Run tree-sitter generate
      const executor = yield* CommandExecutor.CommandExecutor
      const processCommand = Command.make('tree-sitter', 'generate', `${tempDir}/grammar.js`, '-o', tempDir)
      
      const process = yield* executor.start(processCommand).pipe(
        Effect.catchTag('SystemError', (error) =>
          Effect.fail(new GenerateError(`Failed to run tree-sitter: ${error.message}`, error))
        )
      )
      
      const exitCode = yield* process.exitCode
      
      if (exitCode !== 0) {
        yield* Effect.fail(new GenerateError(`tree-sitter generate failed with exit code ${exitCode}`))
      }
      
      // Read generated files
      const grammarJson = yield* fs.readFileString(`${tempDir}/grammar.json`).pipe(
        Effect.catchTag('SystemError', (error) =>
          Effect.fail(new GenerateError(`Failed to read grammar.json: ${error.message}`, error))
        )
      )
      
      const nodeTypes = yield* fs.readFileString(`${tempDir}/node-types.json`).pipe(
        Effect.catchTag('SystemError', (error) =>
          Effect.fail(new GenerateError(`Failed to read node-types.json: ${error.message}`, error))
        )
      )
      
      const parserC = yield* fs.readFileString(`${tempDir}/parser.c`).pipe(
        Effect.catchTag('SystemError', (error) =>
          Effect.fail(new GenerateError(`Failed to read parser.c: ${error.message}`, error))
        )
      )
      
      // Try to read optional headers
      const tryReadHeader = (path: string) =>
        fs.readFileString(path).pipe(
          Effect.option
        )
      
      const parserH = yield* tryReadHeader(`${tempDir}/tree_sitter/parser.h`)
      const allocH = yield* tryReadHeader(`${tempDir}/tree_sitter/alloc.h`)
      const arrayH = yield* tryReadHeader(`${tempDir}/tree_sitter/array.h`)
      
      const headers = (parserH._tag === 'Some' && allocH._tag === 'Some' && arrayH._tag === 'Some')
        ? {
            parserH: parserH.value,
            allocH: allocH.value,
            arrayH: arrayH.value
          }
        : undefined
      
      // Parse JSON files
      const parsedGrammar = yield* Effect.try({
        try: () => JSON.parse(grammarJson) as GrammarJson,
        catch: (error) => new GenerateError(`Failed to parse grammar.json: ${error}`, error)
      })
      
      const parsedNodeTypes = yield* Effect.try({
        try: () => JSON.parse(nodeTypes) as NodeType[],
        catch: (error) => new GenerateError(`Failed to parse node-types.json: ${error}`, error)
      })
      
      return {
        files: {
          grammarJson,
          nodeTypes,
          parserC,
          headers
        },
        parsed: {
          grammar: parsedGrammar,
          nodeTypes: parsedNodeTypes
        }
      }
    })
  )

// For non-Effect users
export const generateAsync = <RuleName extends string>(
  grammar: Grammar<RuleName>
): Promise<GenerateOutput> => {
  const program = generate(grammar).pipe(
    Effect.scoped,
    Effect.provide(NodeContext.layer)
  )
  
  return Effect.runPromise(program)
}