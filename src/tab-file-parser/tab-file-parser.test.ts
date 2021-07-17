import {IDFactory} from '../id-factory/id-factory'
import {parseTabFile} from './tab-file-parser'
import {readFileSync} from 'fs'

let factory: IDFactory = IDFactory()
beforeEach(() => (factory = IDFactory()))

test.each(['\t', ','])('delimiter: "%s"', async delimiter => {
  const row = ['a', 'b', 'c'].join(delimiter)
  const expected = {
    meta: {header: undefined, columnMap: {text: 0}, delimiter, newline: '\n'},
    records: [{id: 1, text: 'a', invalidated: false, row: ['a', 'b', 'c']}]
  }
  expect(await parseTabFile(factory, row)).toStrictEqual(expected)
})

test.each([
  ['linefeed', '\n'],
  ['carriage return and linefeed', '\r\n']
])('newline: %s', async (_, newline) => {
  const input = `text${newline}abc`
  const expected = {
    meta: {header: ['text'], columnMap: {text: 0}, delimiter: '\t', newline},
    records: [{id: 1, text: 'abc', invalidated: false, row: ['abc']}]
  }
  expect(await parseTabFile(factory, input)).toStrictEqual(expected)
})

test('header padding is ignored and preserved', async () => {
  const input = ' animal , text , color \n frog , ribbit , green '
  const expected = {
    meta: {
      header: [' animal ', ' text ', ' color '],
      columnMap: {text: 1},
      delimiter: ',',
      newline: '\n'
    },
    records: [
      {
        id: 1,
        text: ' ribbit ',
        invalidated: false,
        row: [' frog ', ' ribbit ', ' green ']
      }
    ]
  }
  expect(await parseTabFile(factory, input)).toStrictEqual(expected)
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
    records: [
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
  expect(await parseTabFile(factory, input)).toStrictEqual(expected)
})

test('header capitalization is ignored and preserved', async () => {
  const input = ' animal , Text , color \n frog , ribbit , green '
  const expected = {
    meta: {
      header: [' animal ', ' Text ', ' color '],
      columnMap: {text: 1},
      delimiter: ',',
      newline: '\n'
    },
    records: [
      {
        id: 1,
        text: ' ribbit ',
        invalidated: false,
        row: [' frog ', ' ribbit ', ' green ']
      }
    ]
  }
  expect(await parseTabFile(factory, input)).toStrictEqual(expected)
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
])('trailing newline is empty record: %s', async (_, input, expected) => {
  expect((await parseTabFile(factory, input)).records).toStrictEqual(expected)
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
])('missing cells and inconsistencies: %s', async (_, row, expectedRecord) => {
  const header = 'a,text,c\n'
  const input = header + row
  const expected = {
    meta: {
      header: ['a', 'text', 'c'],
      columnMap: {text: 1},
      delimiter: ',',
      newline: '\n'
    },
    records: [expectedRecord]
  }
  expect(await parseTabFile(factory, input)).toStrictEqual(expected)
})

test.each(['games.test.tab', 'groceries.test.tab'])(
  'integration %s',
  async filename => {
    const absoluteFilename = `${__dirname}/tab-file-test-data/${filename}`
    const input = readFileSync(absoluteFilename).toString()
    expect(await parseTabFile(factory, input)).toMatchSnapshot()
  }
)
