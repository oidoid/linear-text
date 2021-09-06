import type {Line} from '../../line/line'
import type {XY} from '../../math/xy'

import {NoteElement} from '../line-element/note-element'

export type LineProps = Readonly<{line: Readonly<Line>; xy: Readonly<XY>}>

export function LineElement({line, xy}: LineProps): JSX.Element {
  return <NoteElement line={line} xy={xy} />
}
