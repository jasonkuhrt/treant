/**
 * SEQ Pattern Detection and Generation
 * 
 * Generates child accessor methods for SEQ patterns in the grammar.
 * SEQ patterns represent ordered sequences of elements.
 */

import type { Grammar } from '@treant/grammar';
import { Core } from '@treant/core';
import * as TS from '../../lib/ts-syntax/$$.js';

/**
 * SEQ pattern member information
 */
export interface SeqMember {
  /** Name of the child (for SYMBOL references) */
  name: string;
  /** Whether this child is optional (wrapped in CHOICE with BLANK) */
  optional: boolean;
  /** The underlying rule reference */
  rule: Grammar.Rule;
}

/**
 * Detect if a rule is a SEQ pattern
 */
export function isSeqPattern(rule: Grammar.Rule): rule is Grammar.SeqRule {
  return rule.type === 'SEQ';
}

/**
 * Check if a rule represents an optional pattern (CHOICE with BLANK)
 */
export function isOptionalPattern(rule: Grammar.Rule): boolean {
  if (rule.type !== 'CHOICE') return false;
  
  const choiceRule = rule as Grammar.ChoiceRule;
  // Check if one of the members is BLANK
  return choiceRule.members.some(member => member.type === 'BLANK');
}

/**
 * Extract the non-blank member from an optional CHOICE pattern
 */
export function extractFromOptional(rule: Grammar.Rule): Grammar.Rule | null {
  if (!isOptionalPattern(rule)) return null;
  
  const choiceRule = rule as Grammar.ChoiceRule;
  const nonBlankMember = choiceRule.members.find(member => member.type !== 'BLANK');
  return nonBlankMember || null;
}

/**
 * Extract members from a SEQ pattern
 */
export function extractSeqMembers(rule: Grammar.SeqRule): SeqMember[] {
  const members: SeqMember[] = [];
  
  for (const member of rule.members) {
    // Skip anonymous strings
    if (member.type === 'STRING') continue;
    
    // Handle optional patterns (CHOICE with BLANK)
    if (isOptionalPattern(member)) {
      const innerRule = extractFromOptional(member);
      if (innerRule && innerRule.type === 'SYMBOL') {
        members.push({
          name: (innerRule as Grammar.SymbolRule<string>).name,
          optional: true,
          rule: innerRule
        });
      } else if (innerRule && innerRule.type === 'FIELD') {
        // Handle FIELD wrapped in optional
        const fieldRule = innerRule as Grammar.FieldRule;
        members.push({
          name: fieldRule.name,
          optional: true,
          rule: innerRule
        });
      }
    }
    // Handle direct SYMBOL references
    else if (member.type === 'SYMBOL') {
      members.push({
        name: (member as Grammar.SymbolRule<string>).name,
        optional: false,
        rule: member
      });
    }
    // Handle FIELD definitions
    else if (member.type === 'FIELD') {
      const fieldRule = member as Grammar.FieldRule;
      members.push({
        name: fieldRule.name,
        optional: false,
        rule: member
      });
    }
  }
  
  return members;
}

/**
 * Generate navigator methods for SEQ pattern
 */
export function generateSeqNavigatorMethods(
  nodeName: string,
  rule: Grammar.SeqRule,
  grammarJson: Grammar.GrammarJson
): string[] {
  const members = extractSeqMembers(rule);
  const methods: string[] = [];
  
  for (const member of members) {
    const methodName = Core.toCamelCase(member.name);
    const navigatorType = `${Core.toPascalCase(member.name)}Navigator`;
    const returnType = member.optional ? `${navigatorType} | null` : navigatorType;
    
    methods.push(`
  /**
   * Navigate to the ${member.name} child${member.optional ? ' (optional)' : ''}
   */
  ${methodName}(): ${returnType};`);
  }
  
  return methods;
}

/**
 * Generate implementation for SEQ navigator
 */
export function generateSeqNavigatorImplementation(
  nodeName: string,
  rule: Grammar.SeqRule,
  grammarJson: Grammar.GrammarJson
): string {
  const members = extractSeqMembers(rule);
  const className = `${Core.toPascalCase(nodeName)}NavigatorImpl`;
  
  const methods: string[] = [];
  
  for (const member of members) {
    const methodName = Core.toCamelCase(member.name);
    
    methods.push(`
  ${methodName}() {
    const child = this.node.childForFieldName('${member.name}');
    ${member.optional 
      ? `return child ? new NavigatorImpl(child) : null;`
      : `return new NavigatorImpl(child!);`
    }
  }`);
  }
  
  return `
class ${className} implements ${TS.toPascalCase(nodeName)}Navigator {
  constructor(private node: Node) {}
  
  value() {
    return this.node;
  }
  
  exists() {
    return this.node != null;
  }
  
  parent() {
    const parent = this.node.parent;
    return parent ? new NavigatorImpl(parent) : null;
  }
  
  ${methods.join('\n')}
}`;
}

/**
 * Analyze a node type to find SEQ patterns
 */
export function analyzeNodeForSeqPattern(
  nodeType: Grammar.NodeType,
  grammarJson: Grammar.GrammarJson
): { hasSeq: boolean; rule?: Grammar.SeqRule; members?: SeqMember[] } {
  // Find the rule for this node type in the grammar
  const ruleName = nodeType.type;
  const rule = grammarJson.rules[ruleName];
  
  if (!rule) {
    return { hasSeq: false };
  }
  
  // Check if it's a SEQ pattern
  if (isSeqPattern(rule)) {
    const members = extractSeqMembers(rule);
    return { hasSeq: true, rule, members };
  }
  
  // Check if the rule references another rule that is a SEQ
  if (rule.type === 'SYMBOL') {
    const symbolRule = rule as Grammar.SymbolRule<string>;
    const referencedRule = grammarJson.rules[symbolRule.name];
    if (referencedRule && isSeqPattern(referencedRule)) {
      const members = extractSeqMembers(referencedRule);
      return { hasSeq: true, rule: referencedRule, members };
    }
  }
  
  return { hasSeq: false };
}