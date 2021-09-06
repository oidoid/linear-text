import {Group} from '../table/group'
import {ID} from '../id/id'
import {IDFactory} from '../id/id-factory'
import {Line} from '../line/line'
import {Table} from './table'

test('An empty table.', () => {
  const factory = IDFactory()
  const table = Table()
  expect(Table.hasGroup(table, ID(1))).toStrictEqual(false)
  expect(Table.hasLine(table, ID(1))).toStrictEqual(false)
  expect(() => Table.getGroup(table, {id: ID(1), x: 0, y: 0})).toThrow()
  expect(() => Table.getLine(table, {id: ID(1), x: 0, y: 0})).toThrow()
  expect(() => Table.removeGroup(table, 0)).toThrow()
  expect(() => Table.removeLine(table, {id: ID(1), x: 0, y: 0})).toThrow()
  expect(Table.appendLine(table, Line(factory, 'abc'), factory)).toStrictEqual({
    id: ID(1),
    x: 0,
    y: 0
  })
  Table.appendGroup(table, Group(factory))
  Table.insertGroup(table, Group(factory), 0)
  expect(
    Table.insertLine(table, Line(factory, 'def'), {x: 0, y: 0}, factory)
  ).toStrictEqual({id: ID(5), x: 0, y: 0})
  const expectedTable: Table = {
    groups: [
      {id: ID(4), lines: [{id: ID(5), text: 'def'}]},
      {id: ID(2), lines: [{id: ID(1), text: 'abc'}]},
      {id: ID(3), lines: []}
    ],
    lineBreak: '\n'
  }
  expect(table).toStrictEqual(expectedTable)
})

test('A non-empty table.', () => {
  const factory = IDFactory()
  const table = Table([
    Group(factory, [
      Line(factory, 'abc'),
      Line(factory, 'def'),
      Line(factory, 'ghi')
    ]),
    Group(factory, [Line(factory, 'jkl'), Line(factory, 'mno')]),
    Group(factory, [Line(factory, 'pqr')])
  ])
  expect(Table.hasGroup(table, ID(4))).toStrictEqual(true)
  expect(Table.hasLine(table, ID(6))).toStrictEqual(true)
  expect(Table.getGroup(table, {id: ID(4), x: 0, y: 0})).toStrictEqual({
    id: ID(4),
    lines: [
      {id: ID(1), text: 'abc'},
      {id: ID(2), text: 'def'},
      {id: ID(3), text: 'ghi'}
    ]
  })
  expect(Table.getLine(table, {id: ID(6), x: 1, y: 1})).toStrictEqual({
    id: ID(6),

    text: 'mno'
  })
  expect(Table.removeGroup(table, 0)).toStrictEqual({
    id: ID(4),
    lines: [
      {id: ID(1), text: 'abc'},
      {id: ID(2), text: 'def'},
      {id: ID(3), text: 'ghi'}
    ]
  })
  expect(Table.removeLine(table, {id: ID(6), x: 0, y: 1})).toStrictEqual({
    id: ID(6),
    text: 'mno'
  })
  Table.appendGroup(table, Group(factory))
  expect(Table.appendLine(table, Line(factory, 'stu'), factory)).toStrictEqual({
    id: ID(11),
    x: 2,
    y: 0
  })
  Table.insertGroup(table, Group(factory), 1)
  expect(
    Table.insertLine(table, Line(factory, 'vwx'), {x: 2, y: 1}, factory)
  ).toStrictEqual({id: ID(13), x: 2, y: 1})
  const expectedTable: Table = {
    groups: [
      {id: ID(7), lines: [{id: ID(5), text: 'jkl'}]},
      {id: ID(12), lines: []},
      {
        id: ID(9),
        lines: [
          {id: ID(8), text: 'pqr'},
          {id: ID(13), text: 'vwx'}
        ]
      },
      {id: ID(10), lines: [{id: ID(11), text: 'stu'}]}
    ],
    lineBreak: '\n'
  }
  expect(table).toStrictEqual(expectedTable)
})
