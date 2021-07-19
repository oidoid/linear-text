import {IDFactory} from '../id/id-factory'
import {parseTable} from './table-parser'
import {readFileSync} from 'fs'

let factory: IDFactory = IDFactory()
beforeEach(() => (factory = IDFactory()))

test.each(['\t', ','])('delimiter: "%s"', async delimiter => {
  const row = ['a', 'b', 'c'].join(delimiter)
  const expected = {
    meta: {header: undefined, columnMap: {text: 0}, delimiter, newline: '\n'},
    lines: [{id: 1, text: 'a', invalidated: false, row: ['a', 'b', 'c']}]
  }
  expect(await parseTable(factory, row)).toStrictEqual(expected)
})

test.each([
  ['linefeed', '\n'],
  ['carriage return and linefeed', '\r\n']
])('newline: %s', async (_, newline) => {
  const input = `text${newline}abc`
  const expected = {
    meta: {header: ['text'], columnMap: {text: 0}, delimiter: '\t', newline},
    lines: [{id: 1, text: 'abc', invalidated: false, row: ['abc']}]
  }
  expect(await parseTable(factory, input)).toStrictEqual(expected)
})

test('header padding is ignored and preserved', async () => {
  const input = ' a , text , c \n 1 , 2 , 3 '
  const expected = {
    meta: {
      header: [' a ', ' text ', ' c '],
      columnMap: {text: 1},
      delimiter: ',',
      newline: '\n'
    },
    lines: [
      {id: 1, text: ' 2 ', invalidated: false, row: [' 1 ', ' 2 ', ' 3 ']}
    ]
  }
  expect(await parseTable(factory, input)).toStrictEqual(expected)
})

test('extra empty columns are ignored and preserved', async () => {
  const input = [
    'a							b							text										d',
    '1							2							3										4'
  ].join('\n') // prettier-ignore
  const expected = {
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
        id: 1,
        text: '3',
        invalidated: false,
        row:         [
          '1', '', '', '', '', '', '',
          '2', '', '', '', '', '', '',
          '3', '', '', '', '', '', '', '', '', '',
          '4'
        ] // prettier-ignore
      }
    ]
  }
  expect(await parseTable(factory, input)).toStrictEqual(expected)
})

test('header capitalization is ignored and preserved', async () => {
  const input = 'a,Text,c\n1,2,3'
  const expected = {
    meta: {
      header: ['a', 'Text', 'c'],
      columnMap: {text: 1},
      delimiter: ',',
      newline: '\n'
    },
    lines: [{id: 1, text: '2', invalidated: false, row: ['1', '2', '3']}]
  }
  expect(await parseTable(factory, input)).toStrictEqual(expected)
})

test.each([
  ['empty file', '', []],
  [
    'empty file with trailing newline',
    '\n',
    [
      {id: 1, text: undefined, invalidated: false, row: ['']},
      {id: 2, text: undefined, invalidated: false, row: ['']}
    ]
  ],
  [
    'empty file with header',
    'text\n',
    [{id: 1, text: '', invalidated: false, row: ['']}]
  ],
  [
    'nonempty file trailing newline',
    'a\n',
    [
      {id: 1, text: 'a', invalidated: false, row: ['a']},
      {id: 2, text: '', invalidated: false, row: ['']}
    ]
  ],
  [
    'nonempty file with header and trailing newline',
    'text\na\n',
    [
      {id: 1, text: 'a', invalidated: false, row: ['a']},
      {id: 2, text: '', invalidated: false, row: ['']}
    ]
  ]
])('trailing newline is an empty Line: %s', async (_, input, expectedLines) => {
  expect((await parseTable(factory, input)).lines).toStrictEqual(expectedLines)
})

test.each([
  [
    'missing leading cell',
    ',2,3',
    {id: 1, text: '2', invalidated: false, row: ['', '2', '3']}
  ],
  [
    'missing middling cell',
    '1,,3',
    {id: 1, text: '', invalidated: false, row: ['1', '', '3']}
  ],
  [
    'missing trailing cell',
    '1,2',
    {id: 1, text: '2', invalidated: false, row: ['1', '2']}
  ],
  [
    'missing trailing cell and trailing comma',
    '1,2,',
    {id: 1, text: '2', invalidated: false, row: ['1', '2', '']}
  ],
  ['missing row', '', {id: 1, text: undefined, invalidated: false, row: ['']}],
  [
    'extra cell',
    '1,2,3,4',
    {id: 1, text: '2', invalidated: false, row: ['1', '2', '3', '4']}
  ]
])('missing cells and inconsistencies: %s', async (_, row, expectedLine) => {
  const header = 'a,text,c\n'
  const input = header + row
  const expected = {
    meta: {
      header: ['a', 'text', 'c'],
      columnMap: {text: 1},
      delimiter: ',',
      newline: '\n'
    },
    lines: [expectedLine]
  }
  expect(await parseTable(factory, input)).toStrictEqual(expected)
})

test.each(['games.test.tab', 'groceries.test.tab'])(
  'integration %s',
  async filename => {
    const absoluteFilename = `${__dirname}/table-parser-test-data/${filename}`
    const input = readFileSync(absoluteFilename).toString()
    expect(await parseTable(factory, input)).toMatchSnapshot()
  }
)
