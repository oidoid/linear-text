import type {TabRecord} from '../../tab/tab-record'

import './group.css'

export type GroupProps = Readonly<{lines: readonly TabRecord[]}>

export function Group({lines}: GroupProps): JSX.Element {
  return (
    <>
      {lines.map(line => (
        <div key={line.id}>{line.text ?? 'empty'}</div>
      ))}
    </>
  )
}
