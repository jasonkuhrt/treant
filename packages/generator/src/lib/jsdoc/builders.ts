/**
 * JSDoc syntax builders for generating documentation comments.
 * Provides a fluent API for building JSDoc blocks programmatically.
 */

/**
 * JSDoc block configuration
 */
export interface JSDocConfig {
  description?: string | string[];
  params?: JSDocParam[];
  returns?: JSDocReturn;
  examples?: JSDocExample[];
  see?: string[];
  since?: string;
  deprecated?: string;
  throws?: string[];
  tags?: JSDocTag[];
}

/**
 * JSDoc parameter definition
 */
export interface JSDocParam {
  name: string;
  type?: string;
  description: string;
  optional?: boolean;
  defaultValue?: string;
}

/**
 * JSDoc return definition
 */
export interface JSDocReturn {
  type?: string;
  description: string;
}

/**
 * JSDoc example definition
 */
export interface JSDocExample {
  caption?: string;
  code: string | string[];
}

/**
 * Generic JSDoc tag
 */
export interface JSDocTag {
  tag: string;
  value: string;
}

/**
 * Build a complete JSDoc comment block
 */
export function buildJSDoc(config: JSDocConfig): string {
  const lines: string[] = ['/**'];

  // Description
  if (config.description) {
    const descLines = Array.isArray(config.description) ? config.description : [config.description];
    descLines.forEach(line => lines.push(` * ${line}`));
    if (hasMoreContent(config)) {
      lines.push(' * ');
    }
  }

  // Parameters
  if (config.params && config.params.length > 0) {
    config.params.forEach(param => {
      lines.push(` * ${formatParam(param)}`);
    });
    if (hasContentAfterParams(config)) {
      lines.push(' * ');
    }
  }

  // Returns
  if (config.returns) {
    lines.push(` * ${formatReturn(config.returns)}`);
    if (hasContentAfterReturns(config)) {
      lines.push(' * ');
    }
  }

  // Throws
  if (config.throws && config.throws.length > 0) {
    config.throws.forEach(error => {
      lines.push(` * @throws ${error}`);
    });
    if (hasContentAfterThrows(config)) {
      lines.push(' * ');
    }
  }

  // Examples
  if (config.examples && config.examples.length > 0) {
    config.examples.forEach(example => {
      lines.push(' * @example');
      if (example.caption) {
        lines.push(` * ${example.caption}`);
      }
      lines.push(' * ```typescript');
      const codeLines = Array.isArray(example.code) ? example.code : [example.code];
      codeLines.forEach(line => lines.push(` * ${line}`));
      lines.push(' * ```');
    });
    if (hasContentAfterExamples(config)) {
      lines.push(' * ');
    }
  }

  // See also
  if (config.see && config.see.length > 0) {
    config.see.forEach(ref => {
      lines.push(` * @see ${ref}`);
    });
    if (hasContentAfterSee(config)) {
      lines.push(' * ');
    }
  }

  // Since
  if (config.since) {
    lines.push(` * @since ${config.since}`);
    if (hasContentAfterSince(config)) {
      lines.push(' * ');
    }
  }

  // Deprecated
  if (config.deprecated) {
    lines.push(` * @deprecated ${config.deprecated}`);
    if (hasContentAfterDeprecated(config)) {
      lines.push(' * ');
    }
  }

  // Custom tags
  if (config.tags && config.tags.length > 0) {
    config.tags.forEach(tag => {
      lines.push(` * @${tag.tag} ${tag.value}`);
    });
  }

  lines.push(' */');
  return lines.join('\n');
}

/**
 * Format a parameter for JSDoc
 */
function formatParam(param: JSDocParam): string {
  let result = '@param';
  
  // Add type if specified
  if (param.type) {
    result += ` {${param.type}}`;
  }
  
  // Add parameter name with optional brackets
  if (param.optional) {
    result += ` [${param.name}${param.defaultValue ? `=${param.defaultValue}` : ''}]`;
  } else {
    result += ` ${param.name}`;
  }
  
  // Add description
  result += ` - ${param.description}`;
  
  return result;
}

/**
 * Format a return statement for JSDoc
 */
function formatReturn(returns: JSDocReturn): string {
  let result = '@returns';
  
  if (returns.type) {
    result += ` {${returns.type}}`;
  }
  
  result += ` ${returns.description}`;
  
  return result;
}

/**
 * Helper functions to determine if there's more content after sections
 */
function hasMoreContent(config: JSDocConfig): boolean {
  return !!(config.params?.length || config.returns || config.throws?.length || 
           config.examples?.length || config.see?.length || config.since || 
           config.deprecated || config.tags?.length);
}

function hasContentAfterParams(config: JSDocConfig): boolean {
  return !!(config.returns || config.throws?.length || config.examples?.length || 
           config.see?.length || config.since || config.deprecated || config.tags?.length);
}

function hasContentAfterReturns(config: JSDocConfig): boolean {
  return !!(config.throws?.length || config.examples?.length || config.see?.length || 
           config.since || config.deprecated || config.tags?.length);
}

function hasContentAfterThrows(config: JSDocConfig): boolean {
  return !!(config.examples?.length || config.see?.length || config.since || 
           config.deprecated || config.tags?.length);
}

function hasContentAfterExamples(config: JSDocConfig): boolean {
  return !!(config.see?.length || config.since || config.deprecated || config.tags?.length);
}

function hasContentAfterSee(config: JSDocConfig): boolean {
  return !!(config.since || config.deprecated || config.tags?.length);
}

function hasContentAfterSince(config: JSDocConfig): boolean {
  return !!(config.deprecated || config.tags?.length);
}

function hasContentAfterDeprecated(config: JSDocConfig): boolean {
  return !!(config.tags?.length);
}

/**
 * Build a simple single-line JSDoc comment
 */
export function buildSimpleJSDoc(description: string): string {
  return `/** ${description} */`;
}

/**
 * Build a JSDoc link reference
 */
export function buildLink(identifier: string, text?: string): string {
  return text ? `{@link ${identifier} ${text}}` : `{@link ${identifier}}`;
}

/**
 * Build a JSDoc comment for a TypeScript interface
 */
export function buildInterfaceJSDoc(name: string, description: string, additionalInfo?: string[]): string {
  const lines = [description];
  if (additionalInfo && additionalInfo.length > 0) {
    lines.push('');
    lines.push(...additionalInfo);
  }
  
  return buildJSDoc({ description: lines });
}

/**
 * Build a JSDoc comment for a type guard function
 */
export function buildTypeGuardJSDoc(config: {
  nodeName: string;
  nodeType: string;
  paramName?: string;
  functionName: string;
}): string {
  const { nodeName, nodeType, paramName = 'node', functionName } = config;
  
  return buildJSDoc({
    description: `Type guard to check if a node is a ${buildLink(nodeName)}.`,
    params: [{
      name: paramName,
      description: 'The node to check'
    }],
    returns: {
      description: `True if the node is a ${buildLink(nodeName)}`
    },
    examples: [{
      code: [
        `if (${functionName}(node)) {`,
        `  // TypeScript now knows node is ${nodeName}`,
        `  console.log(node.type); // '${nodeType}'`,
        '}'
      ]
    }]
  });
}

/**
 * Build a JSDoc comment for a constructor function
 */
export function buildConstructorJSDoc(config: {
  nodeName: string;
  description?: string;
  properties?: Array<{ name: string; type: string; description: string }>;
}): string {
  const { nodeName, description, properties } = config;
  
  const params: JSDocParam[] = [];
  if (properties && properties.length > 0) {
    params.push({
      name: 'props',
      description: 'The node properties'
    });
    
    // Add individual property documentation
    properties.forEach(prop => {
      params.push({
        name: `props.${prop.name}`,
        description: `${buildLink(prop.type)}`
      });
    });
  }
  
  return buildJSDoc({
    description: description || `Creates a new ${buildLink(nodeName)} with the specified properties.`,
    params,
    returns: {
      description: `A new ${buildLink(nodeName)}`
    },
    examples: [{
      code: [
        `const node = ${nodeName}({`,
        '  // properties...',
        '});'
      ]
    }]
  });
}

/**
 * Build a section header comment (for visual separation in generated code)
 */
export function buildSectionHeader(config: {
  title: string;
  subtitle?: string;
  width?: number;
}): string {
  const { title, subtitle, width = 64 } = config;
  const separator = '='.repeat(width);
  
  const lines = [
    '',
    '',
    `// ${separator}`,
    `// ${separator}`,
    '//',
    `//                           ${title}`,
    '//',
  ];
  
  if (subtitle) {
    lines.push(`//        ${subtitle}`);
    lines.push('//');
  }
  
  lines.push(`// ${separator}`);
  lines.push(`// ${separator}`);
  lines.push('');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Build a file header comment
 */
export function buildFileHeader(config: {
  description: string;
  generated?: boolean;
  doNotEdit?: boolean;
}): string {
  const lines: string[] = [];
  
  if (config.generated) {
    lines.push(`// Auto-generated from parser/src/node-types.json`);
    if (config.doNotEdit) {
      lines.push(`// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts`);
    }
    lines.push('');
  }
  
  lines.push(buildJSDoc({ description: config.description }));
  
  return lines.join('\n');
}