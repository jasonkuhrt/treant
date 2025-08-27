/**
 * TypeScript syntax construction helpers
 *
 * Pure functions for building TypeScript syntax without string concatenation
 */

import { toPascalCase } from '../case.js';

// Re-export case utilities for convenience
export { toPascalCase } from '../case.js';

/**
 * Check if a string is a valid TypeScript identifier
 */
export function isValidTypeScriptIdentifier(name: string): boolean {
  // TypeScript identifier rules: must start with letter, $, or _
  // and contain only letters, digits, $, or _
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

// ============= Tree-Sitter Specific Naming Helpers =============

/**
 * Generate TypeScript interface name from a tree-sitter node type
 * Handles invalid identifiers by adding $ suffix
 */
export function getNodeInterfaceName(nodeType: string): string {
  const pascalType = toPascalCase(nodeType);

  // Add $ suffix if the resulting name would be an invalid TS identifier
  if (!isValidTypeScriptIdentifier(pascalType)) {
    return pascalType + '$';
  }

  return pascalType;
}

/**
 * Generate TypeScript type guard function name
 */
export function getTypeGuardName(nodeType: string): string {
  const interfaceName = getNodeInterfaceName(nodeType);
  const guardName = 'is' + interfaceName;

  // Guard name should inherit the aliasing from interface name
  if (!isValidTypeScriptIdentifier(guardName)) {
    return guardName + '$';
  }

  return guardName;
}

/**
 * Generate constructor function name (same as interface name)
 */
export function getConstructorName(nodeType: string): string {
  return getNodeInterfaceName(nodeType);
}

/**
 * Check if a node type needs aliasing (has invalid TypeScript identifier)
 */
export function needsAliasing(nodeType: string): boolean {
  const interfaceName = toPascalCase(nodeType);
  return !isValidTypeScriptIdentifier(interfaceName);
}

/**
 * Generate namespace alias export for invalid identifiers
 */
export function generateNamespaceAlias(nodeType: string): string | null {
  if (!needsAliasing(nodeType)) {
    return null;
  }

  const aliasedName = getNodeInterfaceName(nodeType); // Has $ suffix
  const cleanName = aliasedName.endsWith('$') ? aliasedName.slice(0, -1) : aliasedName;

  return `export { ${aliasedName} as ${cleanName} }`;
}

export interface ImportSpec {
  name: string;
  alias?: string;
  isType?: boolean;
}

export interface ExportSpec {
  name: string;
  alias?: string;
  isType?: boolean;
}

// ============= Import/Export Helpers =============

export function importStatement(specs: ImportSpec[], from: string): string {
  if (specs.length === 0) return '';

  const imports = specs.map(spec => {
    const typePrefix = spec.isType ? 'type ' : '';
    const alias = spec.alias ? ` as ${spec.alias}` : '';
    return `${typePrefix}${spec.name}${alias}`;
  });

  if (imports.length === 1) {
    return `import { ${imports[0]} } from '${from}';`;
  }

  return `import {
${imports.map(i => `  ${i},`).join('\n')}
} from '${from}';`;
}

export function exportStatement(specs: ExportSpec[], from?: string): string {
  if (specs.length === 0) return '';

  const exports = specs.map(spec => {
    const typePrefix = spec.isType ? 'type ' : '';
    const alias = spec.alias ? ` as ${spec.alias}` : '';
    return `${typePrefix}${spec.name}${alias}`;
  });

  const fromClause = from ? ` from '${from}'` : '';

  if (exports.length === 1) {
    return `export { ${exports[0]} }${fromClause};`;
  }

  return `export {
${exports.map(e => `  ${e},`).join('\n')}
}${fromClause};`;
}

export function exportAll(from: string, as?: string): string {
  const asClause = as ? ` as ${as}` : '';
  return `export *${asClause} from '${from}';`;
}

// ============= Type Declaration Helpers =============

export function typeAlias(name: string, type: string): string {
  return `export type ${name} = ${type};`;
}

/**
 * Generate TypeScript template literal type
 */
export function templateLiteralType(parts: string[]): string {
  return `\`\${${parts.join('}\${')}}\``;
}

/**
 * Format TypeScript generic type parameters
 */
export function genericParams(params: string[]): string {
  if (params.length === 0) return '';
  return `<${params.join(', ')}>`;
}

/**
 * Generate conditional type expression
 */
export function conditionalType(
  condition: string,
  trueType: string,
  falseType: string,
): string {
  return `${condition} extends true ? ${trueType} : ${falseType}`;
}

/**
 * Generate mapped type expression
 */
export function mappedType(
  keyType: string,
  valueType: string,
  modifiers?: { readonly?: boolean; optional?: boolean },
): string {
  const readonly = modifiers?.readonly ? 'readonly ' : '';
  const optional = modifiers?.optional ? '?' : '';

  return `{ ${readonly}[K in ${keyType}]${optional}: ${valueType} }`;
}

export function unionType(types: string[], multiline = true): string {
  if (types.length === 0) return 'never';
  if (types.length === 1) return types[0]!;

  if (!multiline) {
    return types.join(' | ');
  }

  return types.map((type, i) => {
    const prefix = i === 0 ? ' ' : '| ';
    return `  ${prefix}${type}`;
  }).join('\n');
}

/**
 * Generate TypeScript union type declaration with export
 */
export function unionTypeDeclaration(
  name: string,
  members: string[],
  exported = true,
): string {
  const exportKeyword = exported ? 'export ' : '';

  if (members.length === 0) {
    return `${exportKeyword}type ${name} = never;`;
  }

  const lines = [`${exportKeyword}type ${name} =`];
  members.forEach((member, index) => {
    const separator = index === 0 ? '' : '|';
    lines.push(`  ${separator} ${member}`);
  });
  lines.push(';');

  return lines.join('\n');
}

/**
 * Emit a union type with proper formatting (compatible with code-emission usage)
 */
export function emitUnionType(types: string[], asLiterals: boolean = true): string {
  const escapeStringLiteral = (str: string): string => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  };

  const emitStringLiteral = (value: string): string => {
    return `'${escapeStringLiteral(value)}'`;
  };

  const emitType = (name: string, asLiteral: boolean = true): string => {
    return asLiteral ? emitStringLiteral(name) : name;
  };

  const formattedTypes = types.map(type => emitType(type, asLiterals));
  return formattedTypes.join(' | ');
}

export function interfaceDeclaration(name: string, members: string[]): string {
  if (members.length === 0) {
    return `export interface ${name} {}`;
  }

  return `export interface ${name} {
${members.map(m => `  ${m}`).join('\n')}
}`;
}

/**
 * Generate TypeScript interface with advanced property options
 */
export function interfaceDeclarationAdvanced(
  name: string,
  extendsClause: string | null,
  properties: Array<{ name: string; type: string; readonly?: boolean; optional?: boolean }>,
): string {
  const extendsText = extendsClause ? ` extends ${extendsClause}` : '';
  const lines = [`export interface ${name}${extendsText} {`];

  properties.forEach(prop => {
    const readonly = prop.readonly ? 'readonly ' : '';
    const optional = prop.optional ? '?' : '';
    lines.push(`  ${readonly}${prop.name}${optional}: ${prop.type};`);
  });

  lines.push('}');
  return lines.join('\n');
}

// ============= Function Declaration Helpers =============

export interface FunctionParam {
  name: string;
  type: string;
}

export function functionDeclaration(
  name: string,
  params: FunctionParam[],
  returnType: string,
  body: string[],
  isExport = true,
  jsdoc?: string,
): string {
  const lines: string[] = [];
  
  if (jsdoc) {
    lines.push(jsdoc);
  }
  
  const exportPrefix = isExport ? 'export ' : '';
  const paramList = params.map(p => `${p.name}: ${p.type}`).join(', ');

  lines.push(`${exportPrefix}function ${name}(${paramList}): ${returnType} {`);
  body.forEach(line => {
    if (line.trim() === '') {
      lines.push('');
    }
    else {
      lines.push(`  ${line}`);
    }
  });
  lines.push('}');

  return lines.join('\n');
}

export function arrowFunction(
  params: FunctionParam[],
  returnType: string,
  body: string | string[],
): string {
  const paramList = params.map(p => `${p.name}: ${p.type}`).join(', ');
  const bodyStr = Array.isArray(body) ? `{\n${body.map(line => `  ${line}`).join('\n')}\n}` : body;

  return `(${paramList}): ${returnType} => ${bodyStr}`;
}

// ============= JSDoc Helpers =============
// Note: For comprehensive JSDoc generation, use jsdoc/builders.ts instead

// ============= Statement Helpers =============

export function ifStatement(condition: string, body: string[]): string {
  return `if (${condition}) {
${body.map(line => `  ${line}`).join('\n')}
}`;
}

export function forLoop(init: string, condition: string, update: string, body: string[]): string {
  return `for (${init}; ${condition}; ${update}) {
${body.map(line => `  ${line}`).join('\n')}
}`;
}

export function returnStatement(expression?: string): string {
  return expression ? `return ${expression};` : 'return;';
}

// ============= Module Building Helpers =============

export class ModuleBuilder {
  private sections: Map<string, string[]> = new Map();

  addSection(name: string, content: string[]): this {
    this.sections.set(name, content);
    return this;
  }

  addImports(...imports: string[]): this {
    const existing = this.sections.get('imports') || [];
    this.sections.set('imports', [...existing, ...imports]);
    return this;
  }

  addExports(...exports: string[]): this {
    const existing = this.sections.get('exports') || [];
    this.sections.set('exports', [...existing, ...exports]);
    return this;
  }

  build(): string {
    const parts: string[] = [];

    // Add file header if present
    if (this.sections.has('header')) {
      parts.push(...this.sections.get('header')!);
      parts.push('');
    }

    // Add imports
    if (this.sections.has('imports')) {
      parts.push(...this.sections.get('imports')!);
      parts.push('');
    }

    // Add all other sections in order
    for (const [name, content] of this.sections) {
      if (name !== 'header' && name !== 'imports') {
        if (content.length > 0) {
          parts.push(...content);
          parts.push('');
        }
      }
    }

    return parts.join('\n');
  }
}

// ============= Common Patterns =============

export function namespaceExport(name: string, from: string): string {
  return exportAll(from, name);
}

export function typeGuard(
  functionName: string,
  paramName: string,
  typeName: string,
  condition: string,
): string {
  return functionDeclaration(
    functionName,
    [{ name: paramName, type: 'unknown' }],
    `${paramName} is ${typeName}`,
    [condition],
  );
}

export function enumObject(name: string, values: Record<string, string>): string {
  const entries = Object.entries(values)
    .map(([key, value]) => `  ${key}: '${value}',`)
    .join('\n');

  return `export const ${name} = {
${entries}
} as const;`;
}

// ============= Additional Syntax Helpers (from type-helpers) =============

/**
 * Generate TypeScript union type members list
 */
export function unionMembers(types: string[]): string[] {
  return types.map((type, index) => {
    const separator = index === 0 ? '' : '|';
    return `  ${separator} ${type}`;
  });
}

/**
 * Generate TypeScript array type literal
 */
export function arrayLiteral(items: string[], itemType: 'string' | 'number' = 'string'): string {
  const quotedItems = itemType === 'string'
    ? items.map(item => `'${item}'`)
    : items.map(String);
  return `[${quotedItems.join(', ')}]`;
}

/**
 * Generate TypeScript const assertion
 */
export function constAssertion(name: string, value: string): string {
  return `export const ${name} = ${value} as const;`;
}

/**
 * Generate relative import statement
 */
export function relativeImport(
  imports: string[],
  modulePath: string,
  isTypeImport = true,
): string {
  const importKeyword = isTypeImport ? 'import type' : 'import';

  if (imports.length === 1) {
    return `${importKeyword} { ${imports[0]} } from '${modulePath}';`;
  }

  return [
    `${importKeyword} {`,
    ...imports.map(imp => `  ${imp},`),
    `} from '${modulePath}';`,
  ].join('\n');
}

// ============= Code Emission Utilities (from code-emission.ts) =============

/**
 * Escape string for TypeScript string literal
 */
export function escapeStringLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Emit a TypeScript string literal with proper quoting and escaping
 */
export function emitStringLiteral(value: string): string {
  return `'${escapeStringLiteral(value)}'`;
}

/**
 * Emit a TypeScript identifier (bare name)
 */
export function emitIdentifier(name: string): string {
  return name;
}

/**
 * Emit a TypeScript type (identifier or literal based on context)
 */
export function emitType(name: string, asLiteral: boolean = true): string {
  return asLiteral ? emitStringLiteral(name) : emitIdentifier(name);
}

/**
 * Emit optional type (Type | null)
 */
export function emitOptionalType(type: string, asLiteral: boolean = true): string {
  return `${emitType(type, asLiteral)} | null`;
}

/**
 * Emit tuple type with proper formatting
 */
export function emitTupleType(types: Array<{ type: string; optional: boolean }>, asLiterals: boolean = true): string {
  const formattedTypes = types.map(t =>
    t.optional ? emitOptionalType(t.type, asLiterals) : emitType(t.type, asLiterals)
  );
  return `[${formattedTypes.join(', ')}]`;
}

/**
 * Emit interface property with proper formatting
 */
export function emitInterfaceProperty(key: string, valueType: string): string {
  return `  ${emitStringLiteral(key)}: ${valueType};`;
}

// ============= Identifier Safety Helpers =============

/**
 * Ensure a name is a safe TypeScript identifier by appending '$' if invalid
 */
export function safeName(name: string): string {
  if (!isValidTypeScriptIdentifier(name)) {
    return name + '$';
  }
  return name;
}
