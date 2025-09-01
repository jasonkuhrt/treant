# Introduction

Tree-sitter grammars define AST structure using patterns. Each pattern type generates specific navigator API shapes.

# Grammar Overview

Before diving into patterns, understand these grammar primitives:

- **SYMBOL**: A reference to another rule (like a function call). Doesn't generate API directly - we follow the reference to see what pattern that rule uses.
- **STRING**: A literal string in the grammar (like `"{"` or `"query"`). Usually ignored in navigation.
- **PATTERN/TOKEN**: Regex patterns for lexical analysis. Generate leaf nodes with `.text()` methods.
- **BLANK**: Represents "nothing" - used in CHOICE to make things optional.

- `SEQ` - ordered sequence of elements

## AST Examples

**Optional field (CHOICE with BLANK)**:

```json
{
  "type": "CHOICE",
  "members": [
    { "type": "SYMBOL", "name": "description" },
    { "type": "BLANK" }
  ]
}
```

**Optional with multiple items (CHOICE of REPEAT and BLANK)**:

```json
{
  "type": "CHOICE",
  "members": [
    { "type": "REPEAT", "content": { "type": "SYMBOL", "name": "directive" } },
    { "type": "BLANK" }
  ]
}
```

**Separated list (SEQ with separators)**:

```json
{
  "type": "SEQ",
  "members": [
    { "type": "SYMBOL", "name": "argument" },
    {
      "type": "REPEAT",
      "content": {
        "type": "SEQ",
        "members": [
          { "type": "STRING", "value": "," },
          { "type": "SYMBOL", "name": "argument" }
        ]
      }
    }
  ]
}
```

## Spec Notation Grammar

This specification uses clear unicode notation to describe navigator patterns:

- `«»` - Interface/structure boundaries
- `◆` - Variable parts (member names, child names, parameters)
- `→` - Return type indicator
- `?` - Optional/nullable indicator
- `«◆KEY: $ → ◆R»` - Object/map structure

**Example**: `if◆MEMBER() → Navigator?` means "method named `if` + member name, returns Navigator or null"

## Interface Summary

```
// SEQ Pattern → Child accessor methods
SEQ_Navigator «
  ◆CHILDNAME() → ChildNavigator        // Required child
  ◆CHILDNAME() → ChildNavigator?       // Optional child (CHOICE with BLANK)
»

// CHOICE Pattern → Type narrowing methods
CHOICE_Navigator «
  // Type guards
  is(◆MEMBER) → boolean               // is('field'), is('variable')
  is◆MEMBER() → boolean               // isField(), isVariable()

  // Conditional navigation
  if(◆MEMBER) → Navigator?            // if('field'), if('variable')
  if◆MEMBER() → Navigator?            // ifField(), ifVariable()

  // Pattern matching with transformation
  match(«◆MEMBER: $ → ◆R») → ◆R1 | ◆R2 | ... | null  // $ = navigator for each member
»

// REPEAT/REPEAT1 Pattern → Collection methods
REPEAT_Navigator «
  ◆PLURALNAME() → CollectionNavigator  // document.definitions()
  at(◆N) → Navigator?
  first() / last() → Navigator?
  filter/where/map/reduce/etc.
  [Symbol.iterator]()
»

// All Navigators → Common methods
BASE_Navigator «
  value() → Node?                      // Get underlying node
  text() → string?                     // For leaf nodes
  exists() → boolean
  parent() / ancestor(◆TYPE) → Navigator?
  when(◆PREDICATE) → Navigator?
»

// Terminal Nodes (PATTERN/TOKEN) → Text methods
LEAF_Navigator «
  text() → string                      // name.text() → "userId"
  value() → LeafNode
»
```

Complete Collection API

```
CollectionNavigator «
  // ============= Chain Continuation Methods =============

  // Single item access (returns navigator)
  at(◆INDEX) → Navigator?
  first() → Navigator?
  last() → Navigator?
  find(◆FN) → Navigator?

  // Filtering (returns collection navigator)
  filter(◆FN) → CollectionNavigator
  where(◆predicate) → CollectionNavigator
  whereType(◆type) → CollectionNavigator
  whereName(◆NAME) → Navigator?
  whereText(◆TEXT) → Navigator?

  // Slicing (returns collection navigator)
  slice(◆START, ◆END?) → CollectionNavigator
  take(◆n) → CollectionNavigator
  skip(◆n) → CollectionNavigator

  // ============= Terminal Methods =============

  // Extract values
  value() → ◆T[]                     // Alias for values()
  values() → ◆T[]                    // Get all underlying nodes
  texts() → (string?)[]              // Get all text content

  // Array transformation (terminal)
  map(◆FN) → ◆R[]
  flatMap(◆fn) → ◆R[]
  reduce(◆fn, ◆INITIAL) → ◆R

  // Array queries (terminal)
  some(◆fn) → boolean
  every(◆fn) → boolean
  includes(◆ITEM) → boolean
  indexOf(◆ITEM) → number
  findIndex(◆fn) → number

  // Other terminals
  count() → number
  length → number                     // Alias for count()
  isEmpty() → boolean
  forEach(◆fn) → void
  toArray() → Navigator[]             // Get array of navigators

  // Iterator protocol
  [Symbol.iterator]() → Iterator
»
```

# Interface Mapping

## SEQ

**What it is**: SEQ defines an ordered sequence of child elements. It's like a struct - specific fields in a specific order.

**Grammar Example**:

```json
{
  "field": {
    "type": "SEQ",
    "members": [
      // Optional alias (CHOICE with BLANK = optional)
      {
        "type": "CHOICE",
        "members": [
          { "type": "SYMBOL", "name": "alias" },
          { "type": "BLANK" }
        ]
      },
      // Required name
      { "type": "SYMBOL", "name": "name" },
      // Optional arguments
      {
        "type": "CHOICE",
        "members": [
          { "type": "SYMBOL", "name": "arguments" },
          { "type": "BLANK" }
        ]
      },
      // Optional directives (can be multiple via REPEAT)
      {
        "type": "CHOICE",
        "members": [
          { "type": "SYMBOL", "name": "directives" },
          { "type": "BLANK" }
        ]
      },
      // Optional selection_set
      {
        "type": "CHOICE",
        "members": [
          { "type": "SYMBOL", "name": "selection_set" },
          { "type": "BLANK" }
        ]
      }
    ]
  }
}
```

**What SEQ generates in the Navigator API**:

- One method per child element
- Methods return navigator or null based on optionality
- Method names match the grammar rule names (camelCased)

**Complete API for SEQ pattern**:

```
FieldNavigator «
  // Each member of the SEQ gets a method
  alias() → AliasNavigator?            // Optional (CHOICE with BLANK)
  name() → NameNavigator                // Required (no BLANK option)
  arguments() → ArgumentsNavigator?     // Optional
  directives() → DirectivesNavigator?   // Optional
  selectionSet() → SelectionSetNavigator? // Optional

  // Common navigator methods
  value() → Field
  text() → string?
  parent() → Navigator?
»
```

**Usage Example**:

```typescript
const field = navigate(selection).ifField();

// Access each part of the sequence
const alias = field?.alias(); // Might be null
const name = field?.name(); // Always exists if field exists
const args = field?.arguments(); // Might be null

// Chain through the structure
const fieldName = field?.name().text(); // "userId"
const aliasName = field?.alias()?.name().text(); // "id" or undefined
```

## CHOICE - Union of Possible Grammar Rules

**What it is**: CHOICE means "at this position, we can have one of several different patterns". It's like a union type - the actual node will be exactly one of the options.

**Grammar Example**:

```json
{
  // A 'value' can be many different types
  "value": {
    "type": "CHOICE",
    "members": [
      { "type": "SYMBOL", "name": "variable" },
      { "type": "SYMBOL", "name": "int_value" },
      { "type": "SYMBOL", "name": "float_value" },
      { "type": "SYMBOL", "name": "string_value" },
      { "type": "SYMBOL", "name": "boolean_value" },
      { "type": "SYMBOL", "name": "null_value" },
      { "type": "SYMBOL", "name": "enum_value" },
      { "type": "SYMBOL", "name": "list_value" },
      { "type": "SYMBOL", "name": "object_value" }
    ]
  }
}
```

**What CHOICE generates in the Navigator API**:

1. A base navigator representing the union
2. Type guard methods (`is()`) to check which variant we have
3. Type narrowing methods (`as*()`) to cast to specific types
4. Pattern matching (`match()`) for exhaustive handling

**Complete API for CHOICE pattern**:

```
ValueNavigator «
  // The underlying node is one of the union members
  value() → Value                      // Union type: Variable | IntValue | FloatValue | ...

  // Type guards - check which variant this is
  is(◆MEMBER) → boolean               // is('variable'), is('int_value'), etc.
  is◆MEMBER() → boolean               // isVariable(), isIntValue(), etc.

  // Conditional navigation - returns navigator only if type matches
  if(◆MEMBER) → ◆MEMBERNAVIGATOR?    // if('variable'), if('int_value'), etc.
  if◆MEMBER() → ◆MEMBERNAVIGATOR?    // ifVariable(), ifIntValue(), etc.

  // Pattern matching - keys map to CHOICE member names from grammar
  // Returns union of all handler return types + null (if unmatched member)
  match(«◆member: $ → ◆R, _?: () → ◆R») → ◆R1 | ◆R2 | ... | null
»
```

**Usage Examples**:

```typescript
// Type guard with narrowing
if (value.is('string_value')) {
  console.log(value.text()); // TypeScript knows it's StringValueNavigator
}

// Conditional navigator
const intValue = value.ifIntValue();
if (intValue) {
  console.log(intValue.text());
}

// Pattern matching
const result = value.match({
  variable: v => `$${v.name().text()}`,
  int_value: i => i.text(),
  _: () => 'complex value',
});
```

## REPEAT/REPEAT1 - Collection Patterns

**What they are**:

- REPEAT: Zero or more occurrences of a pattern
- REPEAT1: One or more occurrences of a pattern

**Grammar Example**:

```json
// REPEAT - can be empty
{
  "directives": {
    "type": "REPEAT",
    "content": { "type": "SYMBOL", "name": "directive" }
  }
}

// REPEAT1 - must have at least one
{
  "definitions": {
    "type": "REPEAT1",
    "content": { "type": "SYMBOL", "name": "definition" }
  }
}
```

**What REPEAT/REPEAT1 generate in the Navigator API**:

- Collection navigator with array-like methods
- Individual item accessors by index
- Query and filtering operations
- Iterator protocol support

**Complete API for REPEAT pattern**:

For REPEAT and REPEAT1 patterns, we'll implement a rich API that combines:

- Full array method compatibility
- Iterator protocol support
- Query-focused operations
- Clear distinction between chain continuation and terminal methods

```
DirectivesNavigator «
  // Access individual items
  at(◆INDEX) → DirectiveNavigator?
  first() → DirectiveNavigator?
  last() → DirectiveNavigator?

  // Query operations
  whereName(◆NAME) → DirectiveNavigator?
  find(◆predicate) → DirectiveNavigator?
  filter(◆predicate) → DirectivesNavigator

  // Terminal operations
  values() → Directive[]
  map(◆FN) → ◆R[]
  count() → number
  isEmpty() → boolean

  // Iterator
  [Symbol.iterator]() → Iterator
»
```

**Usage Examples**:

```typescript
// REPEAT - can be empty
const deprecated = field.directives().whereName('deprecated');

// REPEAT1 - always has items
const firstDef = document.definitions().first(); // Never null

// Collection operations
const operationNames = document
  .definitions()
  .filter(d => d.is('operation_definition'))
  .map(d => d.ifOperationDefinition()?.name()?.text() ?? 'anonymous');
```

## FIELD - Named Fields Pattern

**What it is**: FIELD assigns names to child nodes, making them accessible via specific field names rather than positional access.

**Grammar Example**:

```json
{
  "operation_definition": {
    "type": "SEQ",
    "members": [
      {
        "type": "FIELD",
        "name": "operation_type",
        "content": { "type": "SYMBOL", "name": "operation_type" }
      },
      {
        "type": "FIELD",
        "name": "name",
        "content": {
          "type": "CHOICE",
          "members": [
            { "type": "SYMBOL", "name": "name" },
            { "type": "BLANK" }
          ]
        }
      }
    ]
  }
}
```

**What FIELD generates in the Navigator API**:

- Methods named after the field name
- Return type based on the field's content pattern
- Automatic camelCase conversion of field names

**Usage Example**:

```typescript
const operation = navigate(operationDef);
const type = operation.operationType(); // From FIELD name "operation_type"
const name = operation.name(); // Optional due to CHOICE with BLANK
```

## PREC/PREC_LEFT/PREC_RIGHT/PREC_DYNAMIC - Precedence Patterns

**What they are**: These patterns control parsing precedence and associativity but don't affect the AST structure.

**Grammar Example**:

```json
{
  "type": "PREC_RIGHT",
  "value": 0,
  "content": { "type": "SYMBOL", "name": "selection_set" }
}
```

**What precedence patterns generate**: Nothing! They're transparent to navigation - we generate API based on their content pattern.

## ALIAS - Node Renaming Pattern

**What it is**: ALIAS gives a node a different name in the AST than its grammar rule name.

**Grammar Example**:

```json
{
  "type": "ALIAS",
  "content": { "type": "SYMBOL", "name": "name" },
  "named": true,
  "value": "operation_name"
}
```

**What ALIAS generates**: The navigator uses the alias name instead of the original rule name.

## Terminal Patterns (STRING/PATTERN/TOKEN)

**What they are**: These create leaf nodes in the AST with no children.

**STRING**: Literal keywords like `"query"`, `"mutation"`, `"{"`, etc.

- Usually anonymous nodes (not accessible via navigation)
- Sometimes aliased to be named (e.g., operation types)

**PATTERN/TOKEN**: Regular expressions for identifiers, numbers, strings, etc.

- Always named nodes with `.text()` method
- No child navigation methods

**Complete API for terminal nodes**:

```
NameNavigator «
  value() → Name
  text() → string                      // The actual text content
  parent() → Navigator?

  // No child methods - it's a leaf node
»
```

**Usage Example**:

```typescript
const fieldName = field.name().text(); // "userId"
const intValue = argument.value().ifIntValue()?.text(); // "42"
```

# Examples

```typescript
// Chaining with continuation methods
const userFields = navigate(query)
  .selectionSet()
  .selections()
  .fields() // CollectionNavigator<Field>
  .whereName('user') // Navigator<Field> | null
  ?.selectionSet()
  .selections()
  .fields() // CollectionNavigator<Field>
  .filter(f => !f.alias().exists()) // CollectionNavigator<Field>
  .take(5); // CollectionNavigator<Field>

// Terminal methods end the chain
const fieldNames = userFields.map(f => f.name().text()); // string[]
const hasId = userFields.some(f => f.name().text() === 'id'); // boolean
const fields = userFields.values(); // Node.Field[]

// Using iterator
for (const field of userFields) {
  console.log(field.name().text());
}

// Complex query
const deprecatedFields = navigate(schema)
  .definitions()
  .whereType('object_type_definition')
  .flatMap(obj => obj.fieldsDefinition()?.fields() ?? [])
  .filter(f => f.directives().whereName('deprecated').exists())
  .map(f => ({
    typeName: f.ancestor('object_type_definition')?.name().text(),
    fieldName: f.name().text(),
    deprecationReason: f
      .directives()
      .whereName('deprecated')
      ?.arguments()
      ?.whereName('reason')
      ?.value()
      ?.text(),
  }));
```

At any point in the chain, `.value()` returns the current underlying node(s) with proper typing:

```typescript
// Single navigator
const field: Node.Field | null = navigate(selection)
  .ifField()
  ?.value();

// Collection navigator
const fields: Node.Field[] = navigate(selectionSet)
  .selections()
  .fields()
  .values();

// After filtering
const deprecatedFields: Node.Field[] = navigate(selectionSet)
  .selections()
  .fields()
  .where(f => f.directives().whereName('deprecated').exists())
  .values();

// Nullable chain
const aliasName: Node.Name | null = navigate(field)
  .alias() // Navigator<Node.Alias> | null
  ?.name() // Navigator<Node.Name> | null
  ?.value(); // Node.Name | null
```

Collection Operations

```typescript
// Find all deprecated fields
const deprecatedFields = schema
  .definitions()
  .filter(d => d.is('object_type_definition'))
  .flatMap(obj => obj.fieldsDefinition()?.fields().values() ?? [])
  .filter(f => f.directives()?.whereName('deprecated')?.exists() ?? false)
  .map(f => ({
    type: f.ancestor('object_type_definition')?.name().text(),
    field: f.name().text(),
  }));

// Get operation names
const operationNames = document
  .definitions()
  .filter(d => d.is('operation_definition'))
  .map(d => d.ifOperationDefinition()?.name()?.text() ?? 'anonymous');
```

Pattern Matching

```typescript
// Handle different selection types
const selectionInfo = selection.match({
  field: f => `Field: ${f.name().text()}`,
  fragment_spread: fs => `Fragment: ${fs.fragmentName().text()}`,
  inline_fragment: inf =>
    `Inline on ${inf.typeCondition()?.namedType().name().text()}`,
  _: () => 'Unknown selection',
});

// Type-safe value handling
const valueStr = value.match({
  string_value: s => s.text(),
  int_value: i => i.text(),
  boolean_value: b => b.text(),
  variable: v => `$${v.name().text()}`,
  _: () => 'complex value',
});
```
