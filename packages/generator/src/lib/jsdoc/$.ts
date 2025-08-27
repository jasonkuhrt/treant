/**
 * JSDoc syntax building utilities.
 * 
 * This namespace provides utilities for programmatically generating
 * JSDoc comments with proper formatting and structure.
 * 
 * @example
 * ```typescript
 * import * as JSDoc from './lib/jsdoc/$.js';
 * 
 * const comment = JSDoc.build({
 *   description: 'Does something useful',
 *   params: [{ name: 'value', type: 'string', description: 'The input value' }],
 *   returns: { description: 'The processed result' }
 * });
 * ```
 */

export * from './builders.js';