import type {ID} from '../id/id'
import type {Line} from '../line/line'

import {IDFactory, makeID} from '../id/id-factory'
import {insertContiguous, removeContiguous} from '../utils/array-util'

/**
 * Assumptions:
 * - Zero or one drafts in the group (and Table).
 * - All lines in the group and table have differing IDs. IDs should be unique
 *   but a line should only be a member of one group, not multiply inserted.
 */
// [to-do]: brand Group ID differently than Line ID.
export type Group = Readonly<{id: ID; lines: Line[]}>
export type ReadonlyGroup = Readonly<{id: ID; lines: readonly Readonly<Line>[]}>

export function Group(
  factory: IDFactory,
  lines: Line[] | undefined = []
): Group {
  return {id: makeID(factory), lines}
}

Group.hasLine = (group: Readonly<Group>, id: ID): boolean => {
  return group.lines.some(line => line.id === id)
}

Group.appendLine = (group: Readonly<Group>, line: Line): void => {
  // Line membership is tested for uniqueness at Table level.
  group.lines.push(line)
}

Group.insertLine = (
  group: Readonly<Group>,
  line: Line,
  index: number
): void => {
  // Line membership is tested for uniqueness at Table level.
  insertContiguous(group.lines, line, index)
}

Group.removeLine = (group: Readonly<Group>, index: number): Line => {
  return removeContiguous(group.lines, index)
}
