import type {Line} from '../../line/line'

import {NoteElement} from '../line-element/note-element'

export type LineProps = Readonly<{line: Readonly<Line>; x: number}>

export function LineElement({line, x}: LineProps): JSX.Element {
  return <NoteElement line={line} x={x} />
}
