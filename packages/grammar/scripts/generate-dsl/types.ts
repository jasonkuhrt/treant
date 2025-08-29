#!/usr/bin/env tsx
/**
 * Syncs TypeScript types from tree-sitter-cli/dsl
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')

// Read the types from tree-sitter-cli
const treeSitterDslPath = path.join(projectRoot, 'node_modules/tree-sitter-cli/dsl.d.ts')
const typesContent = fs.readFileSync(treeSitterDslPath, 'utf-8')

// Extract just the type definitions we need
let processedContent = typesContent
  .replace(/^type /gm, 'export type ')
  .replace(/^class /gm, 'export class ')
  .replace(/^interface /gm, 'export interface ')
  // INTENTIONAL DIVERGENCE FROM UPSTREAM:
  // Fix tree-sitter bug where they use `String` (constructor) instead of `string` (primitive).
  // The docs say "Precedence values can either be strings or numbers" (lowercase string).
  // Using the String constructor type is almost certainly a mistake.
  // TODO: Submit PR to tree-sitter to fix this upstream
  .replace(/\bString\s*\|/g, 'string |')
  // Also fix PrecRule types to accept string | number for value
  .replace(/type: 'PREC'; content: Rule; value: number/g, "type: 'PREC'; content: Rule; value: string | number")
  .replace(/type: 'PREC_LEFT'; content: Rule; value: number/g, "type: 'PREC_LEFT'; content: Rule; value: string | number")
  .replace(/type: 'PREC_RIGHT'; content: Rule; value: number/g, "type: 'PREC_RIGHT'; content: Rule; value: string | number")

// Track which functions we've already added type exports for
const typeExports = new Set<string>()

// Convert declare function to export type, keep declare function local (handle overloads)
processedContent = processedContent.replace(
  /^declare function (\w+)/gm,
  (match, name) => {
    if (!typeExports.has(name)) {
      typeExports.add(name)
      return `export type ${name} = typeof ${name};\ndeclare function ${name}`
    }
    return `declare function ${name}`
  }
)

// Convert declare const to export type with the object type, keep declare const local
processedContent = processedContent.replace(
  /^declare const (\w+): (\{[\s\S]*?\n\});/gm,
  (match, name, typeDefinition) => {
    return `export type ${name} = ${typeDefinition};\ndeclare const ${name}: ${name};`
  }
)

const exportedTypes = processedContent

const output = `/* eslint-disable @typescript-eslint/no-unused-vars */
/* oxlint-disable */
/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from tree-sitter-cli/dsl.d.ts
 * Run 'pnpm sync:types' to regenerate
 * 
 * NOTE: This file includes intentional divergences from upstream:
 * - Fixed: String -> string (using primitive type instead of constructor)
 */

${exportedTypes}
`

// Write to our types file
const outputPath = path.join(projectRoot, 'src/generated/dsl/types.ts')
fs.writeFileSync(outputPath, output)

console.log(`✅ Synced types to ${outputPath}`)