/**
 * Repeat rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { RepeatRule } from '../generated/dsl/types.js';

export type { RepeatRule };

export function isRepeatRule(rule: Rule): rule is RepeatRule {
  return rule.type === 'REPEAT';
}