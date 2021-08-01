import {ID} from '../id/id'
import {IDFactory} from '../id/id-factory'
import {Line} from '../line/line'
import {Table} from './table'
import {TableMeta} from './table-meta'

test('A missing line is not found.', () => {
  const table = Table()
  expect(() => Table.findLine(table, ID(0))).toThrow()
})

test('A present line is not found.', () => {
  const factory = IDFactory()
  const map = {text: 0}
  const lines = [Line(factory, map), Line(factory, map), Line(factory, map)]
  const line = lines[1]!
  const table = Table(TableMeta(undefined, map), lines)
  expect(Table.findLine(table, line?.id)).toStrictEqual([line, 1])
})

test('A missing line is not removed.', () => {
  const table = Table()
  expect(() => Table.removeLine(table, ID(0))).toThrow()
})

test('A present line is removed.', () => {
  const factory = IDFactory()
  const map = {text: 0}
  const lines = [Line(factory, map), Line(factory, map), Line(factory, map)]
  const line = lines[1]!
  const table = Table(TableMeta(undefined, map), lines)
  expect(Table.removeLine(table, line?.id)).toStrictEqual([line, 1])
  expect(table.lines).toStrictEqual([lines[0], lines[1]])
})
