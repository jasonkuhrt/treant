/**
 * String rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { StringRule } from '../generated/dsl/types.js';

export type { StringRule };

export function isStringRule(rule: Rule): rule is StringRule {
  return rule.type === 'STRING';
}