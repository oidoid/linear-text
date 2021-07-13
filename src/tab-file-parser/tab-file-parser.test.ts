import {parseTabFile} from './tab-file-parser'
import {readFileSync} from 'fs'
import {TabRecord} from '../tab/tab-record'

test.each(['\t', ','])('delimiter: "%s"', async delimiter => {
  const row = ['a', 'b', 'c'].join(delimiter)
  const expected = {
    meta: {header: undefined, columnMap: {text: 0}, delimiter, newline: '\n'},
    records: [TabRecord.fromRow(['a', 'b', 'c'], 'a')]
  }
  expect(await parseTabFile(row)).toStrictEqual(expected)
})

test.each([
  ['linefeed', '\n'],
  ['carriage return and linefeed', '\r\n']
])('newline: %s', async (_, newline) => {
  const input = `text${newline}abc`
  const expected = {
    meta: {header: ['text'], columnMap: {text: 0}, delimiter: '\t', newline},
    records: [TabRecord.fromRow(['abc'], 'abc')]
  }
  expect(await parseTabFile(input)).toStrictEqual(expected)
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
    records: [TabRecord.fromRow([' frog ', ' ribbit ', ' green '], ' ribbit ')]
  }
  expect(await parseTabFile(input)).toStrictEqual(expected)
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
      TabRecord.fromRow(
        [
          '1', '', '', '', '', '', '',
          '2', '', '', '', '', '', '',
          '3', '', '', '', '', '', '', '', '', '',
          '4'
        ], // prettier-ignore
        '3'
      )
    ]
  }
  expect(await parseTabFile(input)).toStrictEqual(expected)
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
    records: [TabRecord.fromRow([' frog ', ' ribbit ', ' green '], ' ribbit ')]
  }
  expect(await parseTabFile(input)).toStrictEqual(expected)
})

test.each([
  ['empty file', '', []],
  [
    'empty file with trailing newline',
    '\n',
    [TabRecord.fromRow([''], undefined), TabRecord.fromRow([''], undefined)]
  ],
  ['empty file with header', 'text\n', [TabRecord.fromRow([''], '')]],
  [
    'nonempty file trailing newline',
    'a\n',
    [TabRecord.fromRow(['a'], 'a'), TabRecord.fromRow([''], '')]
  ],
  [
    'nonempty file with header and trailing newline',
    'text\na\n',
    [TabRecord.fromRow(['a'], 'a'), TabRecord.fromRow([''], '')]
  ]
])('trailing newline is empty record: %s', async (_, input, expected) => {
  expect((await parseTabFile(input)).records).toStrictEqual(expected)
})

test.each([
  ['missing leading cell', ',2,3', TabRecord.fromRow(['', '2', '3'], '2')],
  ['missing middling cell', '1,,3', TabRecord.fromRow(['1', '', '3'], '')],
  ['missing trailing cell', '1,2', TabRecord.fromRow(['1', '2'], '2')],
  [
    'missing trailing cell and trailing comma',
    '1,2,',
    TabRecord.fromRow(['1', '2', ''], '2')
  ],
  ['missing row', '', TabRecord.fromRow([''], undefined)],
  ['extra cell', '1,2,3,4', TabRecord.fromRow(['1', '2', '3', '4'], '2')]
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
  expect(await parseTabFile(input)).toStrictEqual(expected)
})

test.each(['games.test.tab', 'groceries.test.tab'])(
  'integration %s',
  async filename => {
    const absoluteFilename = `${__dirname}/tab-file-test-data/${filename}`
    const input = readFileSync(absoluteFilename).toString()
    expect(await parseTabFile(input)).toMatchSnapshot()
  }
)
