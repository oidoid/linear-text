import type {LitElement} from 'lit'
import type {Line} from '../tree/text-tree.js'

export type LineElement = LitElement & {
  line?: Readonly<Line> | undefined
  /** Returns the note dimensions */
  readonly rect: DOMRect
}
