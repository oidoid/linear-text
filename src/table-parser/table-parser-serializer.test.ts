import type {ReadonlyTable, Table} from '../table/table'

import {ID} from '../id/id'
import {IDFactory} from '../id/id-factory'
import {parseTable} from './table-parser'
import {serializeTable} from './table-serializer'
import {readFile} from 'fs/promises'

let factory: IDFactory = IDFactory()
beforeEach(() => (factory = IDFactory()))

test.each(<const>[
  ['Linux linefeed', '\n'],
  ['Windows carriage return and linefeed', '\r\n']
])('Line break: %s', async (_, lineBreak) => {
  const input = `abc${lineBreak}def`
  const expected: Table = {
    groups: [
      {
        id: ID(1),
        lines: [
          {id: ID(2), text: 'abc'},
          {id: ID(3), text: 'def'}
        ]
      }
    ],
    lineBreak
  }
  const table = await parseTable(factory, input)
  expect(table).toStrictEqual(expected)
  expect(serializeTable(table)).toStrictEqual(input)
})

test.each(<const>[
  ['An empty file has no groups.', '', {groups: [], lineBreak: '\n'}],
  [
    'A single line file with not text and a trailing newline has one group with no lines.',
    '|',
    {
      groups: [
        {id: ID(1), lines: []},
        {id: ID(2), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A single line file without a trailing newline has one group with one line.',
    'abc',
    {
      groups: [{id: ID(1), lines: [{id: ID(2), text: 'abc'}]}],
      lineBreak: '\n'
    }
  ],
  [
    'A single line file with a trailing newline has one group with one line.',
    'abc|',
    {
      groups: [
        {id: ID(1), lines: [{id: ID(2), text: 'abc'}]},
        {id: ID(3), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A two line file without a trailing newline has one group with two lines.',
    'abc|def',
    {
      groups: [
        {
          id: ID(1),
          lines: [
            {id: ID(2), text: 'abc'},
            {id: ID(3), text: 'def'}
          ]
        }
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A two line file with a trailing newline has one group with two lines.',
    'abc|def|',
    {
      groups: [
        {
          id: ID(1),
          lines: [
            {id: ID(2), text: 'abc'},
            {id: ID(3), text: 'def'}
          ]
        },
        {id: ID(4), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A three line file with a division and without a trailing newline has two groups with one line each.',
    'abc||def',
    {
      groups: [
        {id: ID(1), lines: [{id: ID(2), text: 'abc'}]},
        {id: ID(3), lines: [{id: ID(4), text: 'def'}]}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A three line file with a division and a trailing newline has two groups with one line each.',
    'abc||def|',
    {
      groups: [
        {id: ID(1), lines: [{id: ID(2), text: 'abc'}]},
        {id: ID(3), lines: [{id: ID(4), text: 'def'}]},
        {id: ID(5), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A three group file with various lines.',
    'a||b|c|d||e|',
    {
      groups: [
        {id: ID(1), lines: [{id: ID(2), text: 'a'}]},
        {
          id: ID(3),
          lines: [
            {id: ID(4), text: 'b'},
            {id: ID(5), text: 'c'},
            {id: ID(6), text: 'd'}
          ]
        },
        {id: ID(7), lines: [{id: ID(8), text: 'e'}]},
        {id: ID(9), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A four group file with various lines.',
    'a|||b|c|d||e|',
    {
      groups: [
        {id: ID(1), lines: [{id: ID(2), text: 'a'}]},
        {id: ID(3), lines: []},
        {
          id: ID(4),
          lines: [
            {id: ID(5), text: 'b'},
            {id: ID(6), text: 'c'},
            {id: ID(7), text: 'd'}
          ]
        },
        {id: ID(8), lines: [{id: ID(9), text: 'e'}]},
        {id: ID(10), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'A five group file with various lines.',
    'a||||b|c|d||e|',
    {
      groups: [
        {id: ID(1), lines: [{id: ID(2), text: 'a'}]},
        {id: ID(3), lines: []},
        {id: ID(4), lines: []},
        {
          id: ID(5),
          lines: [
            {id: ID(6), text: 'b'},
            {id: ID(7), text: 'c'},
            {id: ID(8), text: 'd'}
          ]
        },
        {id: ID(9), lines: [{id: ID(10), text: 'e'}]},
        {id: ID(11), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'Three empty groups.',
    '|||',
    {
      groups: [
        {id: ID(1), lines: []},
        {id: ID(2), lines: []},
        {id: ID(3), lines: []},
        {id: ID(4), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'Four empty groups.',
    '||||',
    {
      groups: [
        {id: ID(1), lines: []},
        {id: ID(2), lines: []},
        {id: ID(3), lines: []},
        {id: ID(4), lines: []},
        {id: ID(5), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'Five empty groups.',
    '|||||',
    {
      groups: [
        {id: ID(1), lines: []},
        {id: ID(2), lines: []},
        {id: ID(3), lines: []},
        {id: ID(4), lines: []},
        {id: ID(5), lines: []},
        {id: ID(6), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'Six empty groups.',
    '||||||',
    {
      groups: [
        {id: ID(1), lines: []},
        {id: ID(2), lines: []},
        {id: ID(3), lines: []},
        {id: ID(4), lines: []},
        {id: ID(5), lines: []},
        {id: ID(6), lines: []},
        {id: ID(7), lines: []}
      ],
      lineBreak: '\n'
    }
  ],
  [
    'Seven empty groups.',
    '|||||||',
    {
      groups: [
        {id: ID(1), lines: []},
        {id: ID(2), lines: []},
        {id: ID(3), lines: []},
        {id: ID(4), lines: []},
        {id: ID(5), lines: []},
        {id: ID(6), lines: []},
        {id: ID(7), lines: []},
        {id: ID(8), lines: []}
      ],
      lineBreak: '\n'
    }
  ]
])('%s', async (_, input, expectedTable: ReadonlyTable) => {
  const table = await parseTable(factory, input.replace(/\|/g, '\n'))
  expect(table).toStrictEqual(expectedTable)
  expect(serializeTable(table)).toStrictEqual(input.replace(/\|/g, '\n'))
})

test.each([
  'alphabet.test.txt',
  'animals.test.txt',
  'colors.test.txt',
  'digits.test.txt',
  'empty.test.txt',
  'games.test.txt',
  'groceries.test.txt',
  'perf-1k.test.txt',
  'perf-10k.test.txt',
  'windows.test.txt'
])('integration %s', async filename => {
  const input = await readFile(
    `${__dirname}/table-test-data/${filename}`,
    'utf-8'
  )
  const table = await parseTable(factory, input)
  expect(table).toMatchSnapshot()
  expect(serializeTable(table)).toStrictEqual(input)
})
