import type {ID} from '../id/id'
import type {IDFactory} from '../id/id-factory'
import type {Line} from '../line/line'
import type {LineIndex} from './line-index'

import {assert, NonNull} from '../utils/assert'
import {assertDomain} from '../utils/number-util'
import {Group, ReadonlyGroup} from '../table/group'
import {insertContiguous, removeContiguous} from '../utils/array-util'
import {LineBreak, lineBreakDefault} from './line-break'
import {XY} from '../math/xy'

/** A jagged array of arrays (groups). */
export type Table = Readonly<{groups: Group[]; lineBreak: LineBreak}>
export type ReadonlyTable = Readonly<{
  groups: readonly ReadonlyGroup[]
  lineBreak: LineBreak
}>

export function Table(
  groups: Group[] | undefined = [],
  lineBreak: LineBreak | undefined = lineBreakDefault
): Table {
  return {groups, lineBreak}
}

Table.removeGroup = (table: Readonly<Table>, index: number): Group => {
  const group = removeContiguous(table.groups, index)
  // [to-do]: All lines lost when no preceding group. Is this wanted?
  return group
}

Table.getLine = (table: Readonly<Table>, lineIndex: LineIndex): Line => {
  const group = Table.getGroup(table, lineIndex)
  const line = NonNull(group.lines[lineIndex.y])
  assert(
    line.id === lineIndex.id,
    `Line ID mismatch; ${lineIndex.id} !== ${line.id} at ${XY.format(
      lineIndex
    )}.`
  )
  return line
}

Table.getGroup = (table: Readonly<Table>, lineIndex: LineIndex): Group => {
  return NonNull(table.groups[lineIndex.x])
}

Table.hasGroup = (table: Readonly<Table>, id: ID): boolean => {
  return table.groups.some(group => group.id === id)
}

Table.hasLine = (table: Readonly<Table>, id: ID): boolean => {
  return table.groups.some(group => Group.hasLine(group, id))
}

Table.appendLine = (
  table: Readonly<Table>,
  line: Line,
  factory: IDFactory
): LineIndex => {
  const x = table.groups.length > 0 ? table.groups.length - 1 : 0
  const y = table.groups.length > 0 ? NonNull(table.groups[x]).lines.length : 0
  return Table.insertLine(table, line, {x, y}, factory)
}

Table.insertLine = (
  table: Readonly<Table>,
  line: Line,
  xy: Readonly<XY>,
  factory: IDFactory
): LineIndex => {
  assertDomain(xy.x, 0, table.groups.length, 'inclusive')
  assert(
    !Table.hasLine(table, line.id),
    `Table already contains line with ID of ${line.id}.`
  )
  if (table.groups.length === xy.x) table.groups.push(Group(factory))
  const group = NonNull(table.groups[xy.x])
  Group.insertLine(group, line, xy.y)
  return {id: line.id, x: xy.x, y: xy.y}
}

Table.insertGroup = (
  table: Readonly<Table>,
  group: Group,
  index: number
): number => {
  assert(
    !Table.hasGroup(table, group.id),
    `Table already contains group with ID of ${group.id}.`
  )
  insertContiguous(table.groups, group, index)
  return index
}

Table.appendGroup = (table: Readonly<Table>, group: Group): number => {
  const x = table.groups.length > 0 ? table.groups.length : 0
  return Table.insertGroup(table, group, x)
}

Table.removeLine = (
  table: Readonly<Table>,
  lineIndex: Readonly<LineIndex>
): Line => {
  const group = Table.getGroup(table, lineIndex)
  const line = Group.removeLine(group, lineIndex.y)
  assert(
    line.id === lineIndex.id,
    `Line ID mismatch; ${lineIndex.id} !== ${line.id} at ${XY.format(
      lineIndex
    )}.`
  )
  return line
}
