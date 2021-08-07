import type {Line} from '../line/line'
import type {Table} from '../table/table'

import {ID} from '../id/id'
import {IDFactory} from '../id/id-factory'
import {parseTable} from '../table-parser/table-parser'
import {readFileSync} from 'fs'
import {serializeTable} from '../table-serializer/table-serializer'

let factory: IDFactory = IDFactory()
beforeEach(() => (factory = IDFactory()))

test.each([
  ['linefeed', '\n'],
  ['carriage return and linefeed', '\r\n']
])('newline: %s', async (_, newline) => {
  const input = `abc${newline}def`
  const expected: Table = {
    newline,
    lines: [
      {id: ID(1), state: 'note', text: 'abc'},
      {id: ID(2), state: 'note', text: 'def'}
    ]
  }
  const table = await parseTable(factory, input)
  expect(table).toStrictEqual(expected)
  expect(serializeTable(table)).toStrictEqual(input)
})

test.each(<const>[
  ['empty file', '', []],
  [
    'empty file with trailing newline',
    '\n',
    [
      {id: ID(1), state: 'divider', text: ''},
      {id: ID(2), state: 'divider', text: ''}
    ]
  ],
  [
    'nonempty file trailing newline',
    'a\n',
    [
      {id: ID(1), state: 'note', text: 'a'},
      {id: ID(2), state: 'divider', text: ''}
    ]
  ],
  [
    'nonempty file without trailing newline',
    'a\nb',
    [
      {id: ID(1), state: 'note', text: 'a'},
      {id: ID(2), state: 'note', text: 'b'}
    ]
  ],
  [
    'groups and empty groups',
    'a\n\n\nb\nc\nd\n\ne\n',
    [
      {id: ID(1), state: 'note', text: 'a'},
      {id: ID(2), state: 'divider', text: ''},
      {id: ID(3), state: 'divider', text: ''},
      {id: ID(4), state: 'note', text: 'b'},
      {id: ID(5), state: 'note', text: 'c'},
      {id: ID(6), state: 'note', text: 'd'},
      {id: ID(7), state: 'divider', text: ''},
      {id: ID(8), state: 'note', text: 'e'},
      {id: ID(9), state: 'divider', text: ''}
    ]
  ]
])(
  'trailing newline is an empty Line: %s',
  async (_, input, expectedLines: readonly Readonly<Line>[]) => {
    const table = await parseTable(factory, input)
    expect(table.lines).toStrictEqual(expectedLines)
    expect(serializeTable(table)).toStrictEqual(input)
  }
)

test.each([
  'alphabet.test.txt',
  'colors.test.txt',
  'digits.test.txt',
  'empty.test.txt',
  'games.test.txt',
  'groceries.test.txt',
  'perf-1k.test.txt',
  'perf-10k.test.txt',
  'windows.test.txt'
])('integration %s', async filename => {
  const input = readFileSync(`${__dirname}/${filename}`).toString()
  const table = await parseTable(factory, input)
  expect(table).toMatchSnapshot()
  expect(serializeTable(table)).toStrictEqual(input)
})
