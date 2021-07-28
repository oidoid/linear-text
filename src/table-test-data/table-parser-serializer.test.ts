import type {ReadonlyLine} from '../line/line'
import type {Table} from '../table/table'

import {ID} from '../id/id'
import {IDFactory} from '../id/id-factory'
import {parseTable} from '../table-parser/table-parser'
import {readFileSync} from 'fs'
import {serializeTable} from '../table-serializer/table-serializer'

let factory: IDFactory = IDFactory()
beforeEach(() => (factory = IDFactory()))

test.each(['\t'])('delimiter: "%s"', async delimiter => {
  const input = ['a', 'b', 'c'].join(delimiter)
  const expected: Table = {
    meta: {header: undefined, columnMap: {text: 0}, delimiter, newline: '\n'},
    lines: [{id: ID(1), state: 'note', text: 'a', row: ['a', 'b', 'c']}]
  }
  const table = await parseTable(factory, input)
  expect(table).toStrictEqual(expected)
  expect(serializeTable(table)).toStrictEqual(input)
})

test.each([
  ['linefeed', '\n'],
  ['carriage return and linefeed', '\r\n']
])('newline: %s', async (_, newline) => {
  const input = `text${newline}abc`
  const expected: Table = {
    meta: {header: ['text'], columnMap: {text: 0}, delimiter: '\t', newline},
    lines: [{id: ID(1), state: 'note', text: 'abc', row: ['abc']}]
  }
  const table = await parseTable(factory, input)
  expect(table).toStrictEqual(expected)
  expect(serializeTable(table)).toStrictEqual(input)
})

test('header padding is ignored and preserved', async () => {
  const input = ' a \t text \t c \n 1 \t 2 \t 3 '
  const expected: Table = {
    meta: {
      header: [' a ', ' text ', ' c '],
      columnMap: {text: 1},
      delimiter: '\t',
      newline: '\n'
    },
    lines: [{id: ID(1), state: 'note', text: ' 2 ', row: [' 1 ', ' 2 ', ' 3 ']}]
  }
  const table = await parseTable(factory, input)
  expect(table).toStrictEqual(expected)
  // https://github.com/mholt/PapaParse/issues/888
  // expect(serializeTable(table)).toStrictEqual(input)
})

test('extra empty columns are ignored and preserved', async () => {
  const input = [
    'a							b							text										d',
    '1							2							3										4'
  ].join('\n') // prettier-ignore
  const expected: Table = {
    meta: {
      header: [
        'a', '', '', '', '', '', '',
        'b', '', '', '', '', '', '',
        'text', '', '', '', '', '', '', '', '', '',
        'd'
      ], // prettier-ignore
      columnMap: {text: 14},
      delimiter: '\t',
      newline: '\n'
    },
    lines: [
      {
        id: ID(1),
        state: 'note',
        text: '3',
        row: [
          '1', '', '', '', '', '', '',
          '2', '', '', '', '', '', '',
          '3', '', '', '', '', '', '', '', '', '',
          '4'
        ] // prettier-ignore
      }
    ]
  }
  const table = await parseTable(factory, input)
  expect(table).toStrictEqual(expected)
  expect(serializeTable(table)).toStrictEqual(input)
})

test('header capitalization is ignored and preserved', async () => {
  const input = 'a\tText\tc\n1\t2\t3'
  const expected: Table = {
    meta: {
      header: ['a', 'Text', 'c'],
      columnMap: {text: 1},
      delimiter: '\t',
      newline: '\n'
    },
    lines: [{id: ID(1), state: 'note', text: '2', row: ['1', '2', '3']}]
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
      {id: ID(1), state: 'divider', text: undefined, row: ['']},
      {id: ID(2), state: 'divider', text: undefined, row: ['']}
    ]
  ],
  [
    'empty file with header',
    'text\n',
    [{id: ID(1), state: 'divider', text: '', row: ['']}]
  ],
  [
    'nonempty file trailing newline',
    'a\n',
    [
      {id: ID(1), state: 'note', text: 'a', row: ['a']},
      {id: ID(2), state: 'divider', text: '', row: ['']}
    ]
  ],
  [
    'nonempty file with header and trailing newline',
    'text\na\n',
    [
      {id: ID(1), state: <const>'note', text: 'a', row: ['a']},
      {id: ID(2), state: <const>'divider', text: '', row: ['']}
    ]
  ],
  [
    'nonempty file without trailing newline',
    'a\nb',
    [
      {id: ID(1), state: <const>'note', text: 'a', row: ['a']},
      {id: ID(2), state: <const>'note', text: 'b', row: ['b']}
    ]
  ]
])(
  'trailing newline is an empty Line: %s',
  async (_, input, expectedLines: readonly ReadonlyLine[]) => {
    const table = await parseTable(factory, input)
    expect(table.lines).toStrictEqual(expectedLines)
    expect(serializeTable(table)).toStrictEqual(input)
  }
)

test.each(<const>[
  [
    'missing leading cell',
    '\t2\t3',
    {id: ID(1), state: 'note', text: '2', row: ['', '2', '3']}
  ],
  [
    'missing middling cell',
    '1\t\t3',
    {id: ID(1), state: 'divider', text: '', row: ['1', '', '3']}
  ],
  [
    'missing trailing cell',
    '1\t2',
    {id: ID(1), state: 'note', text: '2', row: ['1', '2']}
  ],
  [
    'missing trailing cell and trailing comma',
    '1\t2\t',
    {id: ID(1), state: 'note', text: '2', row: ['1', '2', '']}
  ],
  [
    'missing row',
    '',
    {id: ID(1), state: 'divider', text: undefined, row: ['']}
  ],
  [
    'extra cell',
    '1\t2\t3\t4',
    {id: ID(1), state: 'note', text: '2', row: ['1', '2', '3', '4']}
  ]
])(
  'missing cells and inconsistencies: %s',
  async (_, row, expectedLine: ReadonlyLine) => {
    const header = 'a\ttext\tc\n'
    const input = header + row
    const expectedTable = {
      meta: {
        header: ['a', 'text', 'c'],
        columnMap: {text: 1},
        delimiter: '\t',
        newline: '\n'
      },
      lines: [expectedLine]
    }
    const table = await parseTable(factory, input)
    expect(table).toStrictEqual(expectedTable)
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
