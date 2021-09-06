import type {IDFactory} from '../id/id-factory'

import {Group} from '../table/group'
import {Line} from '../line/line'
import {Table} from '../table/table'

/** Parse a table from newline-delimited values. */
export async function parseTable(
  factory: IDFactory,
  input: Readonly<File> | string
): Promise<Table> {
  const doc = typeof input === 'string' ? input : await input.text()
  // [to-do] Consider platform since this won't default well on a Windows file
  //   without multiple lines.
  const lineBreak = /\r\n/.test(doc) ? '\r\n' : '\n'
  const table = Table([], lineBreak)
  for (const group of parseGroups(factory, doc)) Table.appendGroup(table, group)
  return table
}

function parseGroups(factory: IDFactory, doc: string): Group[] {
  // Special case: the file is empty and so no note should appear. In contrast,
  // a single newline will create two groups.
  if (doc === '') return []

  const groups: Group[] = []
  let group: Group | undefined
  for (const text of doc.split(/\r?\n/)) {
    if (group == null || text === '') {
      group = Group(factory)
      groups.push(group)
    }
    if (text !== '') Group.appendLine(group, Line(factory, text))
  }
  return groups
}
