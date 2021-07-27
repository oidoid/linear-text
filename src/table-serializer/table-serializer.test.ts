import {readFileSync} from 'fs'
import {IDFactory} from '../id/id-factory'
import {parseTable} from '../table-parser/table-parser'
import {serializeTable} from './table-serializer'

// [to-do] sparse text at save time.

test.each([
  'alphabet.test.tab',
  'colors.test.tab',
  'digits.test.tab',
  'empty.test.tab',
  'games.test.tab',
  'groceries.test.tab'
])('integration %s', async filename => {
  const absoluteFilename = `${__dirname}/../table-test-data/${filename}`
  const input = readFileSync(absoluteFilename).toString()
  const table = await parseTable(IDFactory(), input)
  expect(serializeTable(table)).toStrictEqual(input)
})
