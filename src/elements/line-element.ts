import type { LitElement } from 'npm:lit'
import type { Line } from '../tree/text-tree.ts'

export type LineElement = LitElement & {
  line?: Readonly<Line> | undefined
  /** Returns the note dimensions */
  readonly rect: DOMRect
}
