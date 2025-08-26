/**
 * Grammar Analysis Module
 *
 * Parses grammar.json and node-types.json to extract structural information
 * for generating type-safe AST utilities. This module provides the foundation
 * for understanding the grammar structure and relationships between nodes.
 */

/**
 * Type definitions for node-types.json structure
 */
export interface NodeType {
  type: string;
  named: boolean;
  fields?: Record<string, unknown>;
  children?: {
    multiple: boolean;
    required: boolean;
    types: Array<{ type: string; named: boolean }>;
  };
  extra?: boolean;
  root?: boolean;
}

/**
 * Type definitions for grammar.json structure
 */
export interface GrammarRule {
  type: string;
  name?: string;
  content?: GrammarRule;
  members?: GrammarRule[];
  value?: string | number;
}

export interface Grammar {
  $schema: string;
  name: string;
  rules: Record<string, GrammarRule>;
}

/**
 * Parsed grammar information for code generation
 */
export interface GrammarAnalysis {
  grammarName: string;
  namedNodes: NodeType[];
  anonymousNodes: NodeType[];
  ruleNames: string[];
  nodeTypeMap: Map<string, NodeType>;
  childRelationships: Map<string, Set<string>>;
  parentRelationships: Map<string, Set<string>>;
  grammarRules: Record<string, GrammarRule>;
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
 * Parse and analyze grammar files to extract structural information
 */
export function analyzeGrammar(
  nodeTypes: NodeType[],
  grammarJson: Grammar,
): GrammarAnalysis {
  console.log(`Analyzing grammar: ${grammarJson.name}`);

  const namedNodes = nodeTypes.filter(node => node.named === true);
  const anonymousNodes = nodeTypes.filter(node => node.named === false);
  const ruleNames = namedNodes.map(node => node.type).sort();

  console.log(`Found ${namedNodes.length} named node types`);
  console.log(`Found ${anonymousNodes.length} anonymous node types`);

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

    node.children.types.forEach(childType => {
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

  console.log(`Categorized anonymous nodes:`);
  console.log(`  - ${punctuation.length} punctuation nodes`);
  console.log(`  - ${operators.length} operator nodes`);
  console.log(`  - ${keywords.length} keyword nodes`);
  console.log(`  - ${other.length} other nodes`);

  return { punctuation, operators, keywords, other };
}

/**
 * Extract sequence rules from grammar for generating position-optimized accessors
 */
export function extractSequenceRules(
  grammarRules: Record<string, GrammarRule>,
): Array<{ ruleName: string; rule: GrammarRule }> {
  const sequenceRules: Array<{ ruleName: string; rule: GrammarRule }> = [];

  for (const [ruleName, ruleDefinition] of Object.entries(grammarRules)) {
    if (typeof ruleDefinition === 'object' && ruleDefinition !== null) {
      const rule = ruleDefinition as GrammarRule;
      if (rule.type === 'SEQ' && rule.members) {
        sequenceRules.push({ ruleName, rule });
      }
    }
  }

  console.log(`Found ${sequenceRules.length} sequence rules for accessor generation`);
  return sequenceRules;
}

/**
 * Find all possible child types for a node based on grammar rules
 */
export function getPossibleChildTypes(
  nodeType: string,
  grammarRules: Record<string, GrammarRule>,
): string[] {
  const rule = grammarRules[nodeType];
  if (!rule) return [];

  const childTypes: string[] = [];

  function extractTypesFromRule(r: GrammarRule): void {
    if (r.type === 'SYMBOL' && r.name) {
      childTypes.push(r.name);
    }
    else if (r.type === 'SEQ' && r.members) {
      r.members.forEach(extractTypesFromRule);
    }
    else if (r.type === 'CHOICE' && r.members) {
      r.members.forEach(extractTypesFromRule);
    }
    else if ((r.type === 'REPEAT' || r.type === 'REPEAT1') && r.content) {
      extractTypesFromRule(r.content);
    }
  }

  extractTypesFromRule(rule);
  return Array.from(new Set(childTypes)); // Remove duplicates
}

/**
 * Analyze choice rules for cursor navigation type safety
 */
export function analyzeChoiceRules(grammarRules: Record<string, GrammarRule>): Map<string, string[]> {
  const choiceMap = new Map<string, string[]>();

  for (const [ruleName, rule] of Object.entries(grammarRules)) {
    if (rule.type === 'CHOICE' && rule.members) {
      const choices: string[] = [];

      rule.members.forEach(member => {
        if (member.type === 'SYMBOL' && member.name) {
          choices.push(member.name);
        }
      });

      if (choices.length > 0) {
        choiceMap.set(ruleName, choices);
      }
    }
  }

  console.log(`Found ${choiceMap.size} choice rules for type-safe navigation`);
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

  console.log(`Found ${cycles.length} cycles in grammar graph`);
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
