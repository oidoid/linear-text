import type {ID} from '../id/id'
import type {XY} from '../math/xy'

export type LineIndex = Readonly<{id: ID} & XY>

// [to-do]: It's easy to create an invalid LineIndex ID that refers to a Group
//   or a GroupIndex that refers to a Line ID.
export type GroupIndex = Readonly<{id: ID; x: number}>
