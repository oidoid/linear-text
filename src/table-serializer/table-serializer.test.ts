import {IDFactory} from '../id/id-factory'
import {parseTable} from '../table-parser/table-parser'
import {readFileSync} from 'fs'
import {serializeTable} from './table-serializer'

// [to-do] sparse text at save time.

test.each([
  'alphabet.test.txt',
  'colors.test.txt',
  'digits.test.txt',
  'empty.test.txt',
  'games.test.txt',
  'groceries.test.txt'
])('integration %s', async filename => {
  const absoluteFilename = `${__dirname}/../table-test-data/${filename}`
  const input = readFileSync(absoluteFilename).toString()
  const table = await parseTable(IDFactory(), input)
  expect(serializeTable(table)).toStrictEqual(input)
})
