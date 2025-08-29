/**
 * Immediate token rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { ImmediateTokenRule } from '../generated/dsl/types.js';

export type { ImmediateTokenRule };

export function isImmediateTokenRule(rule: Rule): rule is ImmediateTokenRule {
  return rule.type === 'IMMEDIATE_TOKEN';
}