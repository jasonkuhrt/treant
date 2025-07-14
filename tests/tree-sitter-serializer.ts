// Custom Vitest snapshot serializer for tree-sitter nodes
export const treeSitterSerializer = {
  test(val: any): val is { type: string; childCount: number; startPosition: any; endPosition: any } {
    // Check if this is a tree-sitter node
    return (
      val
      && typeof val === 'object'
      && typeof val.type === 'string'
      && typeof val.childCount === 'number'
      && typeof val.startPosition === 'object'
      && typeof val.endPosition === 'object'
    );
  },

  serialize(node: any, config: any, indentation: string, depth: number, refs: any, printer: any): string {
    const indent = indentation + config.indent;
    const nextDepth = depth + 1;

    // Format position as [row:col]
    const pos =
      `[${node.startPosition.row}:${node.startPosition.column} - ${node.endPosition.row}:${node.endPosition.column}]`;

    // Start with node type and position
    let result = `${node.type} ${pos}`;

    // Add text for leaf nodes
    if (node.childCount === 0 && !node.isNamed) {
      result += ` "${node.text}"`;
    }

    // Add children if any
    if (node.childCount > 0) {
      result += ' {';

      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        result += '\n' + indent + printer(child, config, indent, nextDepth, refs);
      }

      result += '\n' + indentation + '}';
    }

    return result;
  },
};
