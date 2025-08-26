/**
 * TypeScript syntax construction helpers
 *
 * Pure functions for building TypeScript syntax without string concatenation
 */

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

export function unionType(types: string[], multiline = true): string {
  if (types.length === 0) return 'never';
  if (types.length === 1) return types[0];

  if (!multiline) {
    return types.join(' | ');
  }

  return types.map((type, i) => {
    const prefix = i === 0 ? ' ' : '| ';
    return `  ${prefix}${type}`;
  }).join('\n');
}

export function interfaceDeclaration(name: string, members: string[]): string {
  if (members.length === 0) {
    return `export interface ${name} {}`;
  }

  return `export interface ${name} {
${members.map(m => `  ${m}`).join('\n')}
}`;
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
): string {
  const exportPrefix = isExport ? 'export ' : '';
  const paramList = params.map(p => `${p.name}: ${p.type}`).join(', ');

  return `${exportPrefix}function ${name}(${paramList}): ${returnType} {
${body.map(line => `  ${line}`).join('\n')}
}`;
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

export function jsDoc(lines: string[]): string {
  if (lines.length === 0) return '';

  if (lines.length === 1) {
    return `/** ${lines[0]} */`;
  }

  return `/**
${lines.map(line => ` * ${line}`).join('\n')}
 */`;
}

export function jsDocWithExample(description: string[], example?: string[]): string {
  const allLines = [...description];

  if (example && example.length > 0) {
    allLines.push('');
    allLines.push('@example');
    allLines.push('```typescript');
    allLines.push(...example);
    allLines.push('```');
  }

  return jsDoc(allLines);
}

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
