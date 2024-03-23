import {expect, test} from 'vitest'
import type {Line} from './text-tree.js'
import {IDFactory, TextTree} from './text-tree.js'

test('parse an empty line to an empty tree', () =>
  expect(TextTree('', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('parse a nonempty line to a group of one', () =>
  expect(TextTree('a', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('parse nonempty lines to group (×2)', () =>
  expect(TextTree('a\nb', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('parse nonempty lines to group (×3)', () =>
  expect(TextTree('a\nb\nc', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 4,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('two newlines trail the current group', () =>
  expect(TextTree('a\n\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('two newlines and a nonempty line start a group', () =>
  expect(TextTree('a\n\nb', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('two newlines start a group (×3)', () =>
  expect(TextTree('a\n\nb\n\nc', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 6,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 8,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 7,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('multi-line group (0)', () =>
  expect(TextTree('a\nb\n\nc', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 4,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 6,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 5,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('multi-line group (1)', () =>
  expect(TextTree('a\n\nb\nc', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 6,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('multi-line group (2)', () =>
  expect(TextTree('a\n\nb\nc\n\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 6,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 7,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('multi-line groups (3)', () =>
  expect(TextTree('a\nb\nc\n\nd\ne\nf\n\ng\nh\ni', 2, IDFactory()))
    .toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 4,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 5,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 7,
              "indent": 0,
              "text": "d",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 8,
              "indent": 0,
              "text": "e",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 9,
              "indent": 0,
              "text": "f",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 10,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 6,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 12,
              "indent": 0,
              "text": "g",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 13,
              "indent": 0,
              "text": "h",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 14,
              "indent": 0,
              "text": "i",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 11,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('a trailing newline is ignored (0)', () =>
  expect(TextTree('a\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('a trailing newline is ignored (1)', () =>
  expect(TextTree('a\nb\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('a trailing newline is ignored (2)', () =>
  expect(TextTree('a\n\nb\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('a trailing newline is ignored (3)', () =>
  expect(TextTree('a\n\nb\n\nc\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 6,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 8,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 7,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('a trailing newline is ignored (4)', () =>
  expect(TextTree('a\n\nb\nc\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 6,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('an empty line before a group is added to the preceding group (0)', () =>
  expect(TextTree('a\n\n\nb', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 4,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 6,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 5,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('an empty line before a group is added to the preceding group (1)', () =>
  expect(TextTree('a\n\n\n\n\n\nb', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 4,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 5,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 6,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 7,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 9,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 8,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('an empty line before a group is added to the preceding group (2)', () =>
  expect(TextTree('a\n\n\n\n\n\nb\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 4,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 5,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 6,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 7,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 9,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 8,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('an empty line before a group is added to the preceding group (3)', () =>
  expect(TextTree('a\n\n\n\n\n\nb\n\n', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 4,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 5,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 6,
              "type": "EOL",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 7,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 9,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 10,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 8,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('indented lines are subordinates (0)', () =>
  expect(
    TextTree(
      `a
  b
    c
`,
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 4,
                      "indent": 2,
                      "text": "c",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 3,
                  "indent": 1,
                  "text": "b",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('indented lines are subordinates (1)', () =>
  expect(
    TextTree(
      `a
  b
    c
  d
`,
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 4,
                      "indent": 2,
                      "text": "c",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 3,
                  "indent": 1,
                  "text": "b",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 5,
                  "indent": 1,
                  "text": "d",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('indented lines are subordinates (2)', () =>
  expect(
    TextTree(
      `a
b
c
`,
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 4,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('indented lines are subordinates (3)', () =>
  expect(
    TextTree(
      `a
  b
    c

d
  e
  f
    g
  h
    x
i
j
  k

l

`,
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 4,
                      "indent": 2,
                      "text": "c",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 3,
                  "indent": 1,
                  "text": "b",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 5,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 8,
                  "indent": 1,
                  "text": "e",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 10,
                      "indent": 2,
                      "text": "g",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 9,
                  "indent": 1,
                  "text": "f",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 12,
                      "indent": 2,
                      "text": "x",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 11,
                  "indent": 1,
                  "text": "h",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 7,
              "indent": 0,
              "text": "d",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 13,
              "indent": 0,
              "text": "i",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 15,
                  "indent": 1,
                  "text": "k",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 14,
              "indent": 0,
              "text": "j",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 16,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 6,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 18,
              "indent": 0,
              "text": "l",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 19,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 17,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('bad indent at start of file', () =>
  expect(TextTree('  a', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('bad indent after EOL', () =>
  expect(TextTree('\n  a', 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [
                {
                  "down": [],
                  "end": "",
                  "expand": false,
                  "id": 3,
                  "indent": 1,
                  "text": "a",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('bad indent continuation', () =>
  expect(
    TextTree(
      `
a
  b
  c

d
  e

  f
  g

  h

i
  j

  k

l

  m
    n
      o

    p
    q

r
s

  t
u
`.trim(),
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 3,
                  "indent": 1,
                  "text": "b",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 4,
                  "indent": 1,
                  "text": "c",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 5,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 9,
                      "indent": 2,
                      "text": "",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 8,
                  "indent": 1,
                  "text": "e",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 10,
                  "indent": 1,
                  "text": "f",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 12,
                      "indent": 2,
                      "text": "",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 11,
                  "indent": 1,
                  "text": "g",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 13,
                  "indent": 1,
                  "text": "h",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 7,
              "indent": 0,
              "text": "d",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 14,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 6,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 18,
                      "indent": 2,
                      "text": "",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 17,
                  "indent": 1,
                  "text": "j",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 19,
                  "indent": 1,
                  "text": "k",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 16,
              "indent": 0,
              "text": "i",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 20,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 15,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 23,
                  "indent": 1,
                  "text": "",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [
                    {
                      "down": [
                        {
                          "down": [
                            {
                              "down": [],
                              "end": "LF",
                              "expand": false,
                              "id": 27,
                              "indent": 4,
                              "text": "",
                              "type": "Line",
                              "up": [Circular],
                            },
                          ],
                          "end": "LF",
                          "expand": false,
                          "id": 26,
                          "indent": 3,
                          "text": "o",
                          "type": "Line",
                          "up": [Circular],
                        },
                      ],
                      "end": "LF",
                      "expand": false,
                      "id": 25,
                      "indent": 2,
                      "text": "n",
                      "type": "Line",
                      "up": [Circular],
                    },
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 28,
                      "indent": 2,
                      "text": "p",
                      "type": "Line",
                      "up": [Circular],
                    },
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 29,
                      "indent": 2,
                      "text": "q",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 24,
                  "indent": 1,
                  "text": "m",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 22,
              "indent": 0,
              "text": "l",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "id": 30,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 21,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 32,
              "indent": 0,
              "text": "r",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 34,
                  "indent": 1,
                  "text": "",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 35,
                  "indent": 1,
                  "text": "t",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 33,
              "indent": 0,
              "text": "s",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 36,
              "indent": 0,
              "text": "u",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 31,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))
test('bad double indent continuation at group root', () =>
  expect(
    TextTree(
      `
a
b
c
    d
e
  `.trim(),
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "a",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "LF",
              "expand": false,
              "id": 3,
              "indent": 0,
              "text": "b",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [
                {
                  "down": [],
                  "end": "LF",
                  "expand": false,
                  "id": 5,
                  "indent": 2,
                  "text": "d",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 4,
              "indent": 0,
              "text": "c",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 6,
              "indent": 0,
              "text": "e",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('bad double indent continuation at line root', () =>
  expect(
    TextTree(
      `
line
  a
      1
  b
      `.trim(),
      2,
      IDFactory()
    )
  ).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [
                {
                  "down": [
                    {
                      "down": [],
                      "end": "LF",
                      "expand": false,
                      "id": 4,
                      "indent": 3,
                      "text": "1",
                      "type": "Line",
                      "up": [Circular],
                    },
                  ],
                  "end": "LF",
                  "expand": false,
                  "id": 3,
                  "indent": 1,
                  "text": "a",
                  "type": "Line",
                  "up": [Circular],
                },
                {
                  "down": [],
                  "end": "",
                  "expand": false,
                  "id": 5,
                  "indent": 1,
                  "text": "b",
                  "type": "Line",
                  "up": [Circular],
                },
              ],
              "end": "LF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "line",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

test('Windows carriage return and linefeed', () =>
  expect(TextTree(`abc\r\n\r\ndef`, 2, IDFactory())).toMatchInlineSnapshot(`
    {
      "down": [
        {
          "down": [
            {
              "down": [],
              "end": "CRLF",
              "expand": false,
              "id": 2,
              "indent": 0,
              "text": "abc",
              "type": "Line",
              "up": [Circular],
            },
            {
              "down": [],
              "end": "CRLF",
              "id": 3,
              "type": "EOL",
              "up": [Circular],
            },
          ],
          "id": 1,
          "type": "Group",
          "up": [Circular],
        },
        {
          "down": [
            {
              "down": [],
              "end": "",
              "expand": false,
              "id": 5,
              "indent": 0,
              "text": "def",
              "type": "Line",
              "up": [Circular],
            },
          ],
          "id": 4,
          "type": "Group",
          "up": [Circular],
        },
      ],
      "id": 0,
      "indentW": 2,
      "type": "TextTree",
    }
  `))

for (const [name, text] of <const>[
  ['an empty tree is an empty string', ''],

  ['a tree can end without a newline', 'a'],

  ['a redundant newline is not appended (0)', 'a\n'],
  ['a redundant newline is not appended (1)', 'a\nb\n'],
  ['a redundant newline is not appended (2)', 'a\n\nb\n'],
  ['a redundant newline is not appended (3)', 'a\n\nb\n\nc\n'],
  ['a redundant newline is not appended (4)', 'a\n\nb\nc\n'],

  ['multiple nonempty lines (×2)', 'a\nb'],
  ['multiple nonempty lines (×3)', 'a\nb\nc'],

  ['trailing newlines are preserved (0)', '\n'],
  ['trailing newlines are preserved (1)', '\n\n'],
  ['trailing newlines are preserved (2)', '\n\n\n'],
  ['trailing newlines are preserved (3)', 'a\n\n\n\n'],
  ['trailing newlines are preserved (4)', 'a\n'],
  ['trailing newlines are preserved (5)', 'a\nb\n'],
  ['trailing newlines are preserved (6)', 'a\n\nb\n'],
  ['trailing newlines are preserved (7)', 'a\n\nb\n\nc\n'],
  ['trailing newlines are preserved (8)', 'a\n\nb\nc\n'],

  ['multi-line group (1)', 'a\nb\n\nc'],
  ['multi-line group (2)', 'a\n\nb\nc'],
  ['multi-line group (3)', 'a\n\nb\nc\n\n'],
  ['multi-line groups (4)', 'a\nb\nc\n\nd\ne\nf\n\ng\nh\ni'],

  ['spaced out groups (0)', 'a\n\n\nb'],
  ['spaced out groups (1)', 'a\n\n\n\n\n\nb'],
  ['spaced out groups (2)', 'a\n\n\n\n\n\nb\n'],
  ['spaced out groups (3)', 'a\n\n\n\n\n\nb\n\n'],

  ['indent (0)', `a\n  b\n    c\n`],
  ['indent (1)', `a\n  b\n    c\n  d\n`],
  [
    'indent (2)',
    `a\n  b\n    c\n\nd\n  e\n  f\n    g\n  h\n    x\ni\nj\n  k\n\n\nl\n\n\n\n\n`
  ],

  ['windows line break', 'a\r\nb']
]) {
  test(name, () => expect(TextTree.toString(TextTree(text, 2))).toBe(text))
}

test('move above', () => {
  const tree = TextTree('a\nb\nc\n', 2)
  TextTree.moveLine(
    <Line>tree.down[0]!.down[2],
    <Line>tree.down[0]!.down[0],
    'Start'
  )
  expect(TextTree.toString(tree)).toBe('c\na\nb\n')
})
test('move below', () => {
  const tree = TextTree('a\nb\nc\n', 2)
  TextTree.moveLine(
    <Line>tree.down[0]!.down[0],
    <Line>tree.down[0]!.down[2],
    'End'
  )
  expect(TextTree.toString(tree)).toBe('b\nc\na\n')
})

test('move right', () => {
  const tree = TextTree('a\n\nb\n', 2)
  TextTree.moveLine(
    <Line>tree.down[0]!.down[0],
    <Line>tree.down[1]!.down[0],
    'Start'
  )
  expect(TextTree.toString(tree)).toBe('\na\nb\n')
})

test('move down and right', () => {
  const tree = TextTree('a\nb\nc\n\nd\ne\nf\n\ng\nh\ni\n', 2)
  TextTree.moveLine(
    <Line>tree.down[0]!.down[1],
    <Line>tree.down[2]!.down[2],
    'Start'
  )
  expect(TextTree.toString(tree)).toBe('a\nc\n\nd\ne\nf\n\ng\nh\nb\ni\n')
})

test('move indented child to right child', () => {
  const tree = TextTree('a\n  b\n\nc\n', 2)
  TextTree.moveLine(
    (<Line>tree.down[0]!.down[0]).down[0]!,
    <Line>tree.down[1]!.down[0],
    'End'
  )
  expect(TextTree.toString(tree)).toBe('a\n\nc\nb\n')
})

test('move indented child to right up', () => {
  const tree = TextTree('a\n  b\n\nc\n', 2)
  TextTree.moveLine(
    (<Line>tree.down[0]!.down[0]).down[0]!,
    <Line>tree.down[1]!.down[0],
    'Start'
  )
  expect(TextTree.toString(tree)).toBe('a\n\nb\nc\n')
})

test('move source to destination', () => {
  const tree = TextTree('a\nb\nc\n', 2)
  TextTree.moveLine(
    <Line>tree.down[0]!.down[0],
    <Line>tree.down[0]!.down[0],
    'Start'
  )
  expect(TextTree.toString(tree)).toBe('a\nb\nc\n')
})

test('move destination has EOLs', () => {
  const tree = TextTree('a\n\n\n\n\n\nb\n', 2)
  TextTree.moveLine(
    <Line>tree.down[0]!.down[0],
    <Line>tree.down[1]!.down[0],
    'Start'
  )
  expect(TextTree.toString(tree)).toBe('\n\n\n\n\na\nb\n')
  TextTree.moveLine(<Line>tree.down[1]!.down[1], tree.down[0]!, 'In')
  expect(TextTree.toString(tree)).toBe('b\n\n\n\n\n\na\n')
  TextTree.moveLine(<Line>tree.down[1]!.down[0], tree.down[0]!, 'In')
  expect(TextTree.toString(tree)).toBe('a\nb\n\n\n\n\n\n')
})

test('move after peer with children', () => {
  const tree = TextTree(
    `
a
b

A
  B
    C
      D
      E
  F
G
H
`.trim(),
    2
  )
  TextTree.moveLine(
    <Line>tree.down[0]!.down[1],
    <Line>tree.down[1]!.down[0],
    'End'
  )
  expect(TextTree.toString(tree)).toMatchInlineSnapshot(`
    "a

    A
      B
        C
          D
          E
      F
    b
    G
    H"
  `)
})

test('move root line with sublines above an indent line', () => {
  const tree = TextTree(
    `
a
  b
    c

A
  B
    C
`,
    2
  )
  TextTree.moveLine(
    <Line>tree.down[1]!.down[0],
    (<Line>tree.down[2]!.down[0]).down[0]!.down[0]!,
    'Start'
  )
  expect(TextTree.toString(tree)).toBe(
    `

A
  B
    a
      b
        c
    C
`
  )
})

test('move root line with sublines in an indent line', () => {
  const tree = TextTree(
    `
a
  b
    c

A
  B
    C
`,
    2
  )
  TextTree.moveLine(
    <Line>tree.down[1]!.down[0],
    (<Line>tree.down[2]!.down[0]).down[0]!.down[0]!,
    'In'
  )
  expect(TextTree.toString(tree)).toBe(`

A
  B
    C
      a
        b
          c
`)
})

test('move root line with sublines below an indent line', () => {
  const tree = TextTree(
    `
a
  b
    c

A
  B
    C
`,
    2
  )
  TextTree.moveLine(
    <Line>tree.down[1]!.down[0],
    (<Line>tree.down[2]!.down[0]).down[0]!.down[0]!,
    'End'
  )
  expect(TextTree.toString(tree)).toBe(
    `

A
  B
    C
    a
      b
        c
`
  )
})

test('move subline with sublines above an indent line', () => {
  const tree = TextTree(
    `
a
  b
    c
      d
        e
          f

A
  B
    C
`,
    2
  )
  TextTree.moveLine(
    (<Line>tree.down[1]!.down[0]).down[0]!.down[0]!,
    (<Line>tree.down[2]!.down[0]).down[0]!.down[0]!,
    'Start'
  )
  expect(TextTree.toString(tree)).toBe(
    `
a
  b

A
  B
    c
      d
        e
          f
    C
`
  )
})

test('move subline with sublines in an indent line', () => {
  const tree = TextTree(
    `
a
  b
    c
      d
        e
          f

A
  B
    C
`,
    2
  )
  TextTree.moveLine(
    (<Line>tree.down[1]!.down[0]).down[0]!.down[0]!,
    (<Line>tree.down[2]!.down[0]).down[0]!.down[0]!,
    'In'
  )
  expect(TextTree.toString(tree)).toBe(
    `
a
  b

A
  B
    C
      c
        d
          e
            f
`
  )
})

test('move subline with sublines below an indent line', () => {
  const tree = TextTree(
    `
a
  b
    c
      d
        e
          f

A
  B
    C
`,
    2
  )
  TextTree.moveLine(
    (<Line>tree.down[1]!.down[0]).down[0]!.down[0]!,
    (<Line>tree.down[2]!.down[0]).down[0]!.down[0]!,
    'End'
  )
  expect(TextTree.toString(tree)).toBe(
    `
a
  b

A
  B
    C
    c
      d
        e
          f
`
  )
})
