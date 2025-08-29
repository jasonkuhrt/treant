/**
 * Seq rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { SeqRule } from '../generated/dsl/types.js';

export type { SeqRule };

export function isSeqRule(rule: Rule): rule is SeqRule {
  return rule.type === 'SEQ';
}