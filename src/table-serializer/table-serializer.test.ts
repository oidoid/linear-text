import {IDFactory} from '../id/id-factory'
import {Line} from '../line/line'
import {Table} from '../table/table'
import {TableMeta} from '../table/table-meta'
import {serializeTable} from './table-serializer'

test('Inserting a new text column sparsely serializes correctly.', () => {
  const factory = IDFactory()
  const meta = TableMeta(undefined, {text: 3})
  const line = Line(factory, meta.columnMap, false, 'abc')
  const table = Table(meta, [line])
  expect(serializeTable(table)).toStrictEqual('\t\t\tabc')
})

test('Inserting a new text column partly sparsely serializes correctly.', () => {
  const factory = IDFactory()
  const meta = TableMeta(undefined, {text: 3})
  const line = Line(factory, meta.columnMap, false, 'abc', ['1', '2'])
  const table = Table(meta, [line])
  expect(serializeTable(table)).toStrictEqual('1\t2\t\tabc')
})

test('Drafts are never serialized.', () => {
  const factory = IDFactory()
  const meta = TableMeta(undefined, {text: 0})
  const line = Line(factory, meta.columnMap, true, 'abc')
  const table = Table(meta, [line])
  expect(serializeTable(table)).toStrictEqual('')
})
