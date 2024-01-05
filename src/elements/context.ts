import { Line } from '../tree/text-tree.ts'

/** App state that does not trigger UI updates. */
export type Context = {
  focus?: { readonly line: Readonly<Line>; readonly startOfLine: boolean }
}
