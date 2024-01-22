import { assertStrictEquals } from 'std/assert/mod.ts'
import { assertSnapshot } from 'std/testing/snapshot.ts'
import type { Line } from './text-tree.ts'
import { IDFactory, TextTree } from './text-tree.ts'

Deno.test('parse an empty line to an empty tree', async (test) =>
  await assertSnapshot(test, TextTree('', 2, IDFactory()), { dir: '.' }))

Deno.test('parse a nonempty line to a group of one', async (test) =>
  await assertSnapshot(test, TextTree('a', 2, IDFactory()), { dir: '.' }))

Deno.test('parse nonempty lines to group (×2)', async (test) =>
  await assertSnapshot(test, TextTree('a\nb', 2, IDFactory()), { dir: '.' }))

Deno.test('parse nonempty lines to group (×3)', async (test) =>
  await assertSnapshot(test, TextTree('a\nb\nc', 2, IDFactory()), { dir: '.' }))

Deno.test('two newlines trail the current group', async (test) =>
  await assertSnapshot(test, TextTree('a\n\n', 2, IDFactory()), { dir: '.' }))

Deno.test('two newlines and a nonempty line start a group', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('two newlines start a group (×3)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb\n\nc', 2, IDFactory()),
    { dir: '.' },
  ))

Deno.test('multi-line group (0)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\nb\n\nc', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('multi-line group (1)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb\nc', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('multi-line group (2)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb\nc\n\n', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('multi-line groups (3)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\nb\nc\n\nd\ne\nf\n\ng\nh\ni', 2, IDFactory()),
    { dir: '.' },
  ))

Deno.test('a trailing newline is ignored (0)', async (test) =>
  await assertSnapshot(test, TextTree('a\n', 2, IDFactory()), { dir: '.' }))
Deno.test('a trailing newline is ignored (1)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\nb\n', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('a trailing newline is ignored (2)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb\n', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('a trailing newline is ignored (3)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb\n\nc\n', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('a trailing newline is ignored (4)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\nb\nc\n', 2, IDFactory()),
    { dir: '.' },
  ))

Deno.test('an empty line before a group is added to the preceding group (0)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\n\nb', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('an empty line before a group is added to the preceding group (1)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\n\n\n\n\nb', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('an empty line before a group is added to the preceding group (2)', async (test) =>
  await assertSnapshot(
    test,
    TextTree('a\n\n\n\n\n\nb\n', 2, IDFactory()),
    { dir: '.' },
  ))
Deno.test('an empty line before a group is added to the preceding group (3)', async (test) =>
  await assertSnapshot(test, TextTree('a\n\n\n\n\n\nb\n\n', 2, IDFactory()), {
    dir: '.',
  }))

Deno.test('indented lines are subordinates (0)', async (test) =>
  await assertSnapshot(
    test,
    TextTree(
      `a
  b
    c
`,
      2,
      IDFactory(),
    ),
    { dir: '.' },
  ))
Deno.test('indented lines are subordinates (1)', async (test) =>
  await assertSnapshot(
    test,
    TextTree(
      `a
  b
    c
  d
`,
      2,
      IDFactory(),
    ),
    { dir: '.' },
  ))
Deno.test('indented lines are subordinates (2)', async (test) =>
  await assertSnapshot(
    test,
    TextTree(
      `a
b
c
`,
      2,
      IDFactory(),
    ),
    { dir: '.' },
  ))
Deno.test('indented lines are subordinates (3)', async (test) =>
  await assertSnapshot(
    test,
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
      IDFactory(),
    ),
    { dir: '.' },
  ))

Deno.test('bad indent at start of file', async (test) =>
  await assertSnapshot(test, TextTree('  a', 2, IDFactory()), { dir: '.' }))
Deno.test('bad indent after EOL', async (test) =>
  await assertSnapshot(test, TextTree('\n  a', 2, IDFactory()), { dir: '.' }))
Deno.test('bad indent continuation', async (test) =>
  await assertSnapshot(
    test,
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
      IDFactory(),
    ),
    { dir: '.' },
  ))
Deno.test('bad double indent continuation', async (test) =>
  await assertSnapshot(
    test,
    TextTree(
      `
a
b
c
    d
e
  `.trim(),
      2,
      IDFactory(),
    ),
    { dir: '.' },
  ))

Deno.test('Windows carriage return and linefeed', async (test) => {
  const tree = TextTree(`abc\r\n\r\ndef`, 2, IDFactory())
  await assertSnapshot(test, tree, { dir: '.' })
})

for (
  const [name, text] of [
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
      `a\n  b\n    c\n\nd\n  e\n  f\n    g\n  h\n    x\ni\nj\n  k\n\n\nl\n\n\n\n\n`,
    ],

    ['windows line break', 'a\r\nb'],
  ] as const
) {
  Deno.test(
    name,
    () => assertStrictEquals(TextTree.toString(TextTree(text, 2)), text),
  )
}

Deno.test('move above', () => {
  const tree = TextTree('a\nb\nc\n', 2)
  TextTree.moveLine(
    <Line> tree.down[0]!.down[2],
    <Line> tree.down[0]!.down[0],
    'Start',
  )
  assertStrictEquals(TextTree.toString(tree), 'c\na\nb\n')
})
Deno.test('move below', () => {
  const tree = TextTree('a\nb\nc\n', 2)
  TextTree.moveLine(
    <Line> tree.down[0]!.down[0],
    <Line> tree.down[0]!.down[2],
    'End',
  )
  assertStrictEquals(TextTree.toString(tree), 'b\nc\na\n')
})

Deno.test('move right', () => {
  const tree = TextTree('a\n\nb\n', 2)
  TextTree.moveLine(
    <Line> tree.down[0]!.down[0],
    <Line> tree.down[1]!.down[0],
    'Start',
  )
  assertStrictEquals(TextTree.toString(tree), '\na\nb\n')
})

Deno.test('move down and right', () => {
  const tree = TextTree('a\nb\nc\n\nd\ne\nf\n\ng\nh\ni\n', 2)
  TextTree.moveLine(
    <Line> tree.down[0]!.down[1],
    <Line> tree.down[2]!.down[2],
    'Start',
  )
  assertStrictEquals(TextTree.toString(tree), 'a\nc\n\nd\ne\nf\n\ng\nh\nb\ni\n')
})

Deno.test('move indented child to right child', () => {
  const tree = TextTree('a\n  b\n\nc\n', 2)
  TextTree.moveLine(
    (<Line> tree.down[0]!.down[0]).down[0]!,
    <Line> tree.down[1]!.down[0],
    'End',
  )
  assertStrictEquals(TextTree.toString(tree), 'a\n\nc\nb\n')
})

Deno.test('move indented child to right up', () => {
  const tree = TextTree('a\n  b\n\nc\n', 2)
  TextTree.moveLine(
    (<Line> tree.down[0]!.down[0]).down[0]!,
    <Line> tree.down[1]!.down[0],
    'Start',
  )
  assertStrictEquals(TextTree.toString(tree), 'a\n\nb\nc\n')
})

Deno.test('move source to destination', () => {
  const tree = TextTree('a\nb\nc\n', 2)
  TextTree.moveLine(
    <Line> tree.down[0]!.down[0],
    <Line> tree.down[0]!.down[0],
    'Start',
  )
  assertStrictEquals(TextTree.toString(tree), 'a\nb\nc\n')
})

Deno.test('move destination has EOLs', () => {
  const tree = TextTree('a\n\n\n\n\n\nb\n', 2)
  TextTree.moveLine(
    <Line> tree.down[0]!.down[0],
    <Line> tree.down[1]!.down[0],
    'Start',
  )
  assertStrictEquals(TextTree.toString(tree), '\n\n\n\n\na\nb\n')
  TextTree.moveLine(<Line> tree.down[1]!.down[1], tree.down[0]!, 'In')
  assertStrictEquals(TextTree.toString(tree), 'b\n\n\n\n\n\na\n')
  TextTree.moveLine(<Line> tree.down[1]!.down[0], tree.down[0]!, 'In')
  assertStrictEquals(TextTree.toString(tree), 'a\nb\n\n\n\n\n\n')
})

Deno.test('move after peer with children', async (test) => {
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
    2,
  )
  TextTree.moveLine(
    <Line> tree.down[0]!.down[1],
    <Line> tree.down[1]!.down[0],
    'End',
  )
  await assertSnapshot(test, TextTree.toString(tree), { dir: '.' })
})
