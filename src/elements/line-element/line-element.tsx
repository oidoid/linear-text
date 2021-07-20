import type {Line} from '../../line/line'

import {NoteElement} from '../note-element/note-element'

export type LineElementProps = Readonly<{line: Readonly<Line>}>

export function LineElement({line}: LineElementProps): JSX.Element {
  return <NoteElement line={line} />
}
