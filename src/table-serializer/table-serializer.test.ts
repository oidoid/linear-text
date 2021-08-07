import {IDFactory} from '../id/id-factory'
import {Line} from '../line/line'
import {Table} from '../table/table'
import {serializeTable} from './table-serializer'

test('Notes are serialized.', () => {
  const factory = IDFactory()
  const line = Line(factory, false, 'abc')
  const table = Table('\n', [line])
  expect(serializeTable(table)).toStrictEqual('abc')
})

test('Dividers are serialized.', () => {
  const factory = IDFactory()
  const line = Line(factory)
  const table = Table('\n', [line, line])
  expect(serializeTable(table)).toStrictEqual('\n')
})

test('Drafts are never serialized.', () => {
  const factory = IDFactory()
  const line = Line(factory, true, 'abc')
  const table = Table('\n', [line])
  expect(serializeTable(table)).toStrictEqual('')
})

test.each([
  ['Linux', '\n', 'abc\ndef'],
  ['Windows', '\r\n', 'abc\r\ndef']
])('%s newlines are supported.', (_, newline, expected) => {
  const factory = IDFactory()
  const table = Table(newline, [
    Line(factory, false, 'abc'),
    Line(factory, false, 'def')
  ])
  expect(serializeTable(table)).toStrictEqual(expected)
})
