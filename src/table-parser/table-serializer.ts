import {Line} from '../line/line'
import type {Group} from '../table/group'
import type {LineBreak} from '../table/line-break'
import type {Table} from '../table/table'

/** Serialize a table to a newline-delimited value. */
export function serializeTable(table: Readonly<Table>): string {
  const result = table.groups
    .map(group => serializeGroup(group, table.lineBreak))
    .join(table.lineBreak) // the delimiter of every group is a line break but that's in the group
  const trailingLineBreak =
    table.groups[table.groups.length - 1]?.lines.length === 0 &&
    table.groups[table.groups.length - 2]?.lines.length === 0
  return trailingLineBreak
    ? result
    : result.substring(0, result.length - table.lineBreak.length)
}

export function serializeGroup(
  group: Readonly<Group>,
  lineBreak: LineBreak
): string {
  return group.lines
    .filter(line => !Line.isEmpty(line))
    .map(({text}) => `${text}${lineBreak}`)
    .join('') // the delimiter of every line is a line break // Every group contains a line break
}
