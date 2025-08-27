/**
 * Base Generator Infrastructure
 *
 * Shared utilities, formatting, and file I/O operations for all generators.
 * This module provides common functionality to avoid duplication across
 * the modular generator architecture.
 */

import { createStreaming } from '@dprint/formatter';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Configuration for generator formatting and output
 */
export interface GeneratorConfig {
  projectRoot: string;
  grammarName: string;
  grammarNamePascal: string;
  grammarNamespaceExport: string;
  formatter: any;
  outputDir: string;
}

/**
 * Initialize dprint formatter with project configuration
 */
export async function initializeFormatter(projectRoot: string): Promise<any> {
  console.log('Initializing dprint formatter...');

  // Try to read local dprint config
  let dprintConfig: any = {
    typescript: {
      semiColons: 'prefer',
      quoteStyle: 'alwaysSingle',
      useBraces: 'whenNotSingleLine',
      bracePosition: 'sameLineUnlessHanging',
      singleBodyPosition: 'maintain',
      nextControlFlowPosition: 'nextLine',
      trailingCommas: 'onlyMultiLine',
      operatorPosition: 'nextLine',
      preferHanging: false,
      preferSingleLine: false,
    },
  };

  const dprintConfigPath = join(projectRoot, 'dprint.json');
  if (existsSync(dprintConfigPath)) {
    try {
      const configContent = readFileSync(dprintConfigPath, 'utf8');
      dprintConfig = JSON.parse(configContent);
      console.log('Using local dprint.json configuration');
    }
    catch (error) {
      console.warn('Failed to parse dprint.json, using defaults', error);
    }
  }

  // Get TypeScript plugin URL from config or use default
  const tsPluginUrl = dprintConfig.plugins?.find((p: string) => p.includes('typescript'))
    || 'https://plugins.dprint.dev/typescript-0.93.0.wasm';

  const formatter = await createStreaming(fetch(tsPluginUrl));

  // Configure formatter with project settings
  const globalConfig = {
    indentWidth: dprintConfig.typescript?.indentWidth || 2,
    lineWidth: dprintConfig.typescript?.lineWidth || 120,
  };

  formatter.setConfig(globalConfig, dprintConfig.typescript || {});
  return formatter;
}

/**
 * Write a formatted TypeScript file with error handling
 */
export async function writeFormattedFile(
  filePath: string,
  content: string,
  formatter: any,
): Promise<void> {
  try {
    // formatText is synchronous, not async
    const formatted = formatter.formatText(filePath, content);
    writeFileSync(filePath, formatted || content, 'utf8');
  }
  catch (error) {
    console.warn(`Warning: Failed to format ${filePath}, writing unformatted`, error);
    writeFileSync(filePath, content, 'utf8');
  }
}

/**
 * Generate a large section header for code organization
 */
export function generateSectionHeader(title: string, subtitle?: string): string {
  const lines = [
    '',
    '',
    '// ================================================================',
    '// ================================================================',
    '//',
    `//                           ${title}`,
    '//',
  ];

  if (subtitle) {
    lines.push(`//        ${subtitle}`);
    lines.push('//');
  }

  lines.push('// ================================================================');
  lines.push('// ================================================================');
  lines.push('');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate standard file header for auto-generated files
 */
export function generateFileHeader(description: string): string {
  return [
    '// Auto-generated from parser/src/node-types.json and parser/src/grammar.json',
    '// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts',
    '//',
    `// ${description}`,
    '',
  ].join('\n');
}

/**
 * Generate imports section for TypeScript files
 */
export function generateImports(imports: string[]): string {
  if (imports.length === 0) return '';

  const lines = [...imports, ''];
  return lines.join('\n');
}

/**
 * Generate JSDoc comment block
 */
export function generateJSDoc(lines: string[]): string {
  const jsdocLines = ['/**'];
  lines.forEach(line => {
    jsdocLines.push(line.startsWith(' *') ? line : ` * ${line}`);
  });
  jsdocLines.push(' */');
  return jsdocLines.join('\n');
}

/**
 * Utility to collect unique imports while generating code
 */
export class ImportCollector {
  private imports = new Map<string, Set<string>>();

  /**
   * Add an import to the collection
   * @param module - Module path (e.g., './nodes/field.js')
   * @param name - Import name (e.g., 'FieldNode')
   */
  addImport(module: string, name: string): void {
    if (!this.imports.has(module)) {
      this.imports.set(module, new Set());
    }
    this.imports.get(module)!.add(name);
  }

  /**
   * Add a type import to the collection
   */
  addTypeImport(module: string, name: string): void {
    this.addImport(module, name);
  }

  /**
   * Generate import statements from collected imports
   */
  generateImportStatements(): string[] {
    const statements: string[] = [];

    this.imports.forEach((names, module) => {
      const sortedNames = Array.from(names).sort();
      if (sortedNames.length === 1) {
        statements.push(`import type { ${sortedNames[0]} } from '${module}';`);
      }
      else {
        statements.push(`import type {`);
        sortedNames.forEach(name => {
          statements.push(`  ${name},`);
        });
        statements.push(`} from '${module}';`);
      }
    });

    return statements;
  }

  /**
   * Clear all collected imports
   */
  clear(): void {
    this.imports.clear();
  }
}

/**
 * Generate TypeScript interface definition
 */
export function generateInterface(
  name: string,
  extendsClause: string | null,
  properties: Array<{ name: string; type: string; readonly?: boolean; optional?: boolean }>,
): string[] {
  const lines: string[] = [];

  const extendsText = extendsClause ? ` extends ${extendsClause}` : '';
  lines.push(`export interface ${name}${extendsText} {`);

  properties.forEach(prop => {
    const readonly = prop.readonly ? 'readonly ' : '';
    const optional = prop.optional ? '?' : '';
    lines.push(`  ${readonly}${prop.name}${optional}: ${prop.type};`);
  });

  lines.push('}');
  return lines;
}

/**
 * Generate TypeScript union type
 */
export function generateUnionType(
  name: string,
  members: string[],
  exported = true,
): string[] {
  const lines: string[] = [];
  const exportKeyword = exported ? 'export ' : '';

  if (members.length === 0) {
    lines.push(`${exportKeyword}type ${name} = never;`);
    return lines;
  }

  lines.push(`${exportKeyword}type ${name} =`);
  members.forEach((member, index) => {
    const separator = index === 0 ? '' : '|';
    lines.push(`  ${separator} ${member}`);
  });
  lines.push(';');

  return lines;
}

/**
 * Generate a TypeScript function with proper formatting
 */
export function generateFunction(
  name: string,
  parameters: Array<{ name: string; type: string }>,
  returnType: string,
  body: string[],
  exported = true,
  jsdoc?: string[],
): string[] {
  const lines: string[] = [];

  if (jsdoc && jsdoc.length > 0) {
    lines.push(generateJSDoc(jsdoc));
  }

  const exportKeyword = exported ? 'export ' : '';
  const params = parameters.map(p => `${p.name}: ${p.type}`).join(', ');

  lines.push(`${exportKeyword}function ${name}(${params}): ${returnType} {`);
  body.forEach(line => {
    if (line.trim() === '') {
      lines.push('');
    }
    else {
      lines.push(`  ${line}`);
    }
  });
  lines.push('}');

  return lines;
}
