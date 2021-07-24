import type {Line} from '../../line/line'

import {NoteElement} from '../note-element/note-element'

export type LineProps = Readonly<{line: Readonly<Line>}>

export function LineElement({line}: LineProps): JSX.Element {
  return <NoteElement line={line} />
}
