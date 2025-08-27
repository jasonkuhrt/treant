/**
 * Analysis utilities for tree-sitter grammar rules.
 * These functions extract information and patterns from grammar structures.
 * 
 * This module provides comprehensive analysis of tree-sitter grammars including
 * structural information extraction, relationship analysis, and pattern detection.
 */

import type { GrammarJson } from './grammar-json.js';
import type { NodeType } from './node-type.js';
import * as RuleKinds from './rule-kinds/$.js';
import type { Rule } from './rule.js';
import { Rules } from './rules/$.js';

/**
 * Parsed grammar information for comprehensive analysis
 */
export interface GrammarAnalysis {
  grammarName: string;
  namedNodes: NodeType[];
  anonymousNodes: NodeType[];
  ruleNames: string[];
  nodeTypeMap: Map<string, NodeType>;
  childRelationships: Map<string, Set<string>>;
  parentRelationships: Map<string, Set<string>>;
  grammarRules: Record<string, Rule>;
}

/**
 * Categorized anonymous nodes for better organization
 */
export interface AnonymousNodeCategories {
  punctuation: string[];
  operators: string[];
  keywords: string[];
  other: string[];
}

/**
 * Get all SYMBOL members from a CHOICE rule
 */
export function getSymbolMembers(rule: Rules.ChoiceRule): Rules.SymbolRule[] {
  return rule.members.filter(Rules.isSymbolRule);
}

/**
 * Get symbol names from a CHOICE rule
 */
export function getSymbolMemberNames(rule: Rules.ChoiceRule): string[] {
  return getSymbolMembers(rule).map(member => member.name);
}

/**
 * Detect semantic groupings in grammar rules.
 * A semantic grouping is a CHOICE rule where all members are SYMBOLs.
 */
export function detectSemanticGroupings(rules: Record<string, Rule>): Map<string, string[]> {
  const groupings = new Map<string, string[]>();

  for (const [ruleName, rule] of Object.entries(rules)) {
    if (Rules.isChoiceRule(rule)) {
      const symbolMembers = getSymbolMembers(rule);
      // Check if all members are symbols and there's more than one
      if (symbolMembers.length === rule.members.length && symbolMembers.length > 1) {
        groupings.set(ruleName, symbolMembers.map(m => m.name));
      }
    }
  }

  return groupings;
}

/**
 * Extract all child types that can appear under a rule
 */
export function extractChildTypes(rule: Rule): string[] {
  const childTypes = new Set<string>();

  function traverse(r: Rule): void {
    if (Rules.isSymbolRule(r)) {
      childTypes.add(r.name);
    }
    else if (RuleKinds.isWithMembers(r)) {
      r.members.forEach(traverse);
    }
    else if (RuleKinds.isWithContent(r)) {
      traverse((r as any).content);
    }
  }

  traverse(rule);
  return Array.from(childTypes);
}

/**
 * Extract direct child types from a SEQ rule
 */
export function extractDirectChildTypes(rule: Rules.SeqRule): Array<{ type: string; isOptional: boolean }> {
  const childTypes: Array<{ type: string; isOptional: boolean }> = [];

  rule.members.forEach(member => {
    if (Rules.isSymbolRule(member)) {
      childTypes.push({ type: member.name, isOptional: false });
    }
    else if (RuleKinds.isOptional(member) && Rules.isChoiceRule(member)) {
      const content = RuleKinds.getOptionalContent(member);
      if (content && Rules.isSymbolRule(content)) {
        childTypes.push({ type: content.name, isOptional: true });
      }
    }
  });

  return childTypes;
}

/**
 * Find all rules that reference a given symbol
 */
export function findSymbolReferences(grammar: GrammarJson, symbolName: string): string[] {
  const references: string[] = [];

  for (const [ruleName, rule] of Object.entries(grammar.rules)) {
    const childTypes = extractChildTypes(rule);
    if (childTypes.includes(symbolName)) {
      references.push(ruleName);
    }
  }

  return references;
}

/**
 * Check if a rule is a simple alias (just references another rule)
 */
export function isSimpleAlias(rule: Rule): rule is Rules.SymbolRule {
  return Rules.isSymbolRule(rule);
}

/**
 * Get all terminal rules (STRING or PATTERN)
 */
export function getTerminalRules(rules: Record<string, Rule>): Record<string, Rule> {
  const terminals: Record<string, Rule> = {};

  for (const [name, rule] of Object.entries(rules)) {
    if (Rules.isStringRule(rule) || Rules.isPatternRule(rule)) {
      terminals[name] = rule;
    }
  }

  return terminals;
}

/**
 * Get all rules that can match empty string
 */
export function getNullableRules(rules: Record<string, Rule>): Set<string> {
  const nullable = new Set<string>();
  const visited = new Set<string>();

  function isNullable(ruleName: string): boolean {
    if (visited.has(ruleName)) {
      return nullable.has(ruleName);
    }
    visited.add(ruleName);

    const rule = rules[ruleName];
    if (!rule) return false;

    if (Rules.isBlankRule(rule)) {
      nullable.add(ruleName);
      return true;
    }

    if (Rules.isRepeatRule(rule)) {
      nullable.add(ruleName);
      return true;
    }

    if (Rules.isChoiceRule(rule)) {
      // A choice is nullable if any member is nullable
      const hasNullableMember = rule.members.some(member => {
        if (Rules.isBlankRule(member)) return true;
        if (Rules.isSymbolRule(member)) return isNullable(member.name);
        return false;
      });
      if (hasNullableMember) {
        nullable.add(ruleName);
        return true;
      }
    }

    if (Rules.isSeqRule(rule)) {
      // A sequence is nullable if all members are nullable
      const allNullable = rule.members.every(member => {
        if (Rules.isBlankRule(member)) return true;
        if (Rules.isSymbolRule(member)) return isNullable(member.name);
        if (Rules.isRepeatRule(member)) return true;
        return false;
      });
      if (allNullable) {
        nullable.add(ruleName);
        return true;
      }
    }

    return false;
  }

  // Check all rules
  for (const ruleName of Object.keys(rules)) {
    isNullable(ruleName);
  }

  return nullable;
}

/**
 * Get the root rule name (usually 'source_file' or the first rule)
 */
export function getRootRuleName(grammar: GrammarJson): string {
  // Check for common root rule names
  if ('source_file' in grammar.rules) return 'source_file';
  if ('program' in grammar.rules) return 'program';
  if ('document' in grammar.rules) return 'document';

  // Otherwise return the first rule
  const firstRule = Object.keys(grammar.rules)[0];
  if (!firstRule) {
    throw new Error('Grammar has no rules');
  }
  return firstRule;
}

// ================================================================
// COMPREHENSIVE GRAMMAR ANALYSIS FUNCTIONS
// ================================================================

/**
 * Parse and analyze grammar files to extract structural information
 */
export function analyzeGrammar(
  nodeTypes: NodeType[],
  grammarJson: GrammarJson,
): GrammarAnalysis {
  const namedNodes = nodeTypes.filter(node => node.named === true);
  const anonymousNodes = nodeTypes.filter(node => node.named === false);
  const ruleNames = namedNodes.map(node => node.type).sort();

  // Build node type map for quick lookup
  const nodeTypeMap = new Map<string, NodeType>();
  nodeTypes.forEach(node => {
    nodeTypeMap.set(node.type, node);
  });

  // Analyze child/parent relationships
  const { childRelationships, parentRelationships } = analyzeRelationships(namedNodes);

  return {
    grammarName: grammarJson.name,
    namedNodes,
    anonymousNodes,
    ruleNames,
    nodeTypeMap,
    childRelationships,
    parentRelationships,
    grammarRules: grammarJson.rules,
  };
}

/**
 * Analyze parent-child relationships between nodes
 */
function analyzeRelationships(namedNodes: NodeType[]): {
  childRelationships: Map<string, Set<string>>;
  parentRelationships: Map<string, Set<string>>;
} {
  const childRelationships = new Map<string, Set<string>>();
  const parentRelationships = new Map<string, Set<string>>();

  namedNodes.forEach(node => {
    if (!node.children) return;

    const nodeType = node.type;
    if (!childRelationships.has(nodeType)) {
      childRelationships.set(nodeType, new Set());
    }

    node.children.types.forEach((childType: any) => {
      if (!childType.named) return; // Skip anonymous nodes for relationships

      // Add child relationship
      childRelationships.get(nodeType)!.add(childType.type);

      // Add parent relationship
      if (!parentRelationships.has(childType.type)) {
        parentRelationships.set(childType.type, new Set());
      }
      parentRelationships.get(childType.type)!.add(nodeType);
    });
  });

  return { childRelationships, parentRelationships };
}

/**
 * Categorize anonymous nodes for better organization
 */
export function categorizeAnonymousNodes(anonymousNodes: NodeType[]): AnonymousNodeCategories {
  const punctuation = anonymousNodes
    .filter(node => node.type.length === 1 && /^[^a-zA-Z0-9]$/.test(node.type))
    .map(node => node.type);

  const operators = anonymousNodes
    .filter(node => node.type.length > 1 && /^[^a-zA-Z0-9]+$/.test(node.type))
    .map(node => node.type);

  const keywords = anonymousNodes
    .filter(node => /^[a-z]+$/.test(node.type))
    .map(node => node.type);

  const other = anonymousNodes
    .filter(node =>
      !punctuation.includes(node.type)
      && !operators.includes(node.type)
      && !keywords.includes(node.type)
    )
    .map(node => node.type);

  return { punctuation, operators, keywords, other };
}

/**
 * Extract sequence rules from grammar for generating position-optimized accessors
 */
export function extractSequenceRules(
  grammarRules: Record<string, Rule>,
): Array<{ ruleName: string; rule: Rule }> {
  const sequenceRules: Array<{ ruleName: string; rule: Rule }> = [];

  for (const [ruleName, rule] of Object.entries(grammarRules)) {
    if (rule.type === 'SEQ') {
      sequenceRules.push({ ruleName, rule });
    }
  }

  return sequenceRules;
}

/**
 * Find all possible child types for a node based on grammar rules
 */
export function getPossibleChildTypes(
  nodeType: string,
  grammarRules: Record<string, Rule>,
): string[] {
  const rule = grammarRules[nodeType];
  if (!rule) return [];

  const childTypes: string[] = [];

  function extractTypesFromRule(r: Rule): void {
    switch (r.type) {
      case 'SYMBOL':
        childTypes.push((r as any).name);
        break;
      case 'SEQ':
      case 'CHOICE':
        (r as any).members.forEach(extractTypesFromRule);
        break;
      case 'REPEAT':
      case 'REPEAT1':
        extractTypesFromRule((r as any).content);
        break;
      case 'FIELD':
        extractTypesFromRule((r as any).content);
        break;
      case 'ALIAS':
        extractTypesFromRule((r as any).content);
        break;
      case 'TOKEN':
        extractTypesFromRule((r as any).content);
        break;
      case 'PREC':
      case 'PREC_LEFT':
      case 'PREC_RIGHT':
      case 'PREC_DYNAMIC':
        extractTypesFromRule((r as any).content);
        break;
      // Terminal rules don't contribute child types
      case 'STRING':
      case 'PATTERN':
      case 'BLANK':
      case 'IMMEDIATE_TOKEN':
        break;
    }
  }

  extractTypesFromRule(rule);
  return Array.from(new Set(childTypes)); // Remove duplicates
}

/**
 * Analyze choice rules for cursor navigation type safety
 */
export function analyzeChoiceRules(grammarRules: Record<string, Rule>): Map<string, string[]> {
  const choiceMap = new Map<string, string[]>();

  for (const [ruleName, rule] of Object.entries(grammarRules)) {
    if (rule.type === 'CHOICE') {
      const choices: string[] = [];

      (rule as any).members.forEach((member: any) => {
        if (member.type === 'SYMBOL') {
          choices.push(member.name);
        }
      });

      if (choices.length > 0) {
        choiceMap.set(ruleName, choices);
      }
    }
  }

  return choiceMap;
}

/**
 * Find cycles in the grammar graph for handling recursive structures
 */
export function findGrammarCycles(
  childRelationships: Map<string, Set<string>>,
): string[][] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(node: string, path: string[]): void {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart).concat(node));
      }
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    recursionStack.add(node);

    const children = childRelationships.get(node) || new Set();
    children.forEach(child => {
      dfs(child, [...path, node]);
    });

    recursionStack.delete(node);
  }

  // Start DFS from all nodes to catch all cycles
  childRelationships.forEach((_, node) => {
    if (!visited.has(node)) {
      dfs(node, []);
    }
  });

  return cycles;
}

/**
 * Calculate node depth statistics for cursor navigation optimization
 */
export function analyzeNodeDepths(
  namedNodes: NodeType[],
  childRelationships: Map<string, Set<string>>,
): Map<string, { maxDepth: number; avgChildCount: number }> {
  const depthStats = new Map<string, { maxDepth: number; avgChildCount: number }>();

  function calculateMaxDepth(nodeType: string, visited: Set<string>): number {
    if (visited.has(nodeType)) return 0; // Prevent infinite recursion

    visited.add(nodeType);
    const children = childRelationships.get(nodeType) || new Set();

    if (children.size === 0) return 1;

    let maxChildDepth = 0;
    children.forEach(child => {
      const childDepth = calculateMaxDepth(child, new Set(visited));
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    });

    return maxChildDepth + 1;
  }

  namedNodes.forEach(node => {
    const maxDepth = calculateMaxDepth(node.type, new Set());
    const children = childRelationships.get(node.type) || new Set();
    const avgChildCount = children.size;

    depthStats.set(node.type, { maxDepth, avgChildCount });
  });

  return depthStats;
}
