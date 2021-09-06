import {Group} from '../table/group'
import {IDFactory} from '../id/id-factory'
import {Line} from '../line/line'
import {Table} from '../table/table'
import {serializeTable} from './table-serializer'

test('Notes are serialized.', () => {
  const factory = IDFactory()
  const table = Table([Group(factory, [Line(factory, 'abc')])])
  expect(serializeTable(table)).toStrictEqual('abc')
})

test('Groups are serialized.', () => {
  const factory = IDFactory()
  const table = Table()
  Table.appendGroup(table, Group(factory))
  Table.appendGroup(table, Group(factory))
  expect(serializeTable(table)).toStrictEqual('\n')
})

test('Drafts are never serialized.', () => {
  const factory = IDFactory()
  const table = Table([Group(factory, [Line(factory)])])
  expect(serializeTable(table)).toStrictEqual('')
})
