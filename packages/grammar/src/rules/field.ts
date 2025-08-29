/**
 * Field rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { FieldRule } from '../generated/dsl/types.js';

export type { FieldRule };

export function isFieldRule(rule: Rule): rule is FieldRule {
  return rule.type === 'FIELD';
}