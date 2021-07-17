import type {Line} from '../../line/line'

import './group.css'

export type GroupProps = Readonly<{lines: readonly Readonly<Line>[]}>

export function Group({lines}: GroupProps): JSX.Element {
  return (
    <>
      {lines.map(line => (
        <div key={line.id}>{line.text ?? 'empty'}</div>
      ))}
    </>
  )
}
