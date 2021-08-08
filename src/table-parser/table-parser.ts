import type {IDFactory} from '../id/id-factory'
import type {Table} from '../table/table'

import {Line} from '../line/line'

/** Parse a table from newline delimited values. */
export async function parseTable(
  factory: IDFactory,
  input: Readonly<File> | string
): Promise<Table> {
  const text = typeof input === 'string' ? input : await input.text()
  // [to-do] Consider platform since this won't default well on a Windows file
  //   without multiple lines.
  const lineBreak = /\r\n/.test(text) ? '\r\n' : '\n'
  return {lineBreak, lines: parseLines(factory, text)}
}

function parseLines(factory: IDFactory, text: string): Line[] {
  // Special case: the file is empty and so no note should appear. In constrast,
  // a single newline will create two notes.
  if (text === '') return []
  return text.split(/\r?\n/).map(text => parseLine(factory, text))
}

function parseLine(factory: IDFactory, text: string): Line {
  return Line(factory, false, text)
}
