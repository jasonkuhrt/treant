import { describe, test as base, expect } from "vitest";
import { Parser, Language } from "web-tree-sitter";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { treeSitterSerializer } from "./tree-sitter-serializer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = join(__dirname, "..", "grammar.wasm");

// Create custom test with parser fixture
const test = base.extend({
  parser: async ({}, use) => {
    // Initialize parser
    await Parser.init();
    const parser = new Parser();

    // Load GraphQL grammar from WASM
    const wasmBuffer = readFileSync(wasmPath);
    const GraphQL = await Language.load(wasmBuffer);
    parser.setLanguage(GraphQL);

    // Provide parser to tests
    await use(parser);
  },
});

describe("GraphQL Parser", () => {
  // Register custom snapshot serializer for tree-sitter nodes
  expect.addSnapshotSerializer(treeSitterSerializer);
  test("parses simple GraphQL document", ({ parser }) => {
    const document = readFileSync(
      join(__dirname, "fixtures", "simple.graphql"),
      "utf-8",
    );
    const tree = parser.parse(document);
    expect(tree.rootNode.hasError).toBe(false);
  });

  test("parses comprehensive GraphQL document", ({ parser }) => {
    // Load comprehensive GraphQL document from file
    const graphqlDocument = readFileSync(
      join(__dirname, "fixtures", "comprehensive.graphql"),
      "utf-8",
    );

    // Parse the document
    const tree = parser.parse(graphqlDocument);

    // Snapshot test the AST structure
    expect(tree.rootNode).toMatchSnapshot();
    expect(tree.rootNode.hasError).toBe(false);
  });
});
