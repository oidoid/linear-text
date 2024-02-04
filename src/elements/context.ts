import type {Line} from '../tree/text-tree.js'

/** App state that does not trigger UI updates. */
export type Context = {
  focus?: {readonly line: Readonly<Line>; readonly startOfLine: boolean}
}
