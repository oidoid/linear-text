import {ReactNode, SyntheticEvent, useState} from 'react'

import {useCallback, useMemo} from 'react'

import './disclosure-element.css'

export type DisclosureElementProps = Readonly<{
  children: ReactNode
  'data-testid'?: string
  onToggle?(open: boolean): void
  open?: boolean
  summary: ReactNode
  title: string
}>

export function DisclosureElement({
  children,
  'data-testid': testID,
  onToggle,
  open: initOpen = false,
  summary,
  title
}: DisclosureElementProps): JSX.Element {
  const [open, setOpen] = useState(initOpen)

  const onToggleCb = useCallback(
    (ev: SyntheticEvent<HTMLDetailsElement>) => {
      setOpen(ev.currentTarget.open)
      onToggle?.(ev.currentTarget.open)
    },
    [onToggle, setOpen]
  )

  const summaryClassName = useMemo(
    () =>
      `disclosure-element__summary buttonish-element ${
        open ? 'buttonish-element--active' : ''
      }`,
    [open]
  )

  return (
    <details
      className='disclosure-element'
      data-testid={testID}
      onToggle={onToggleCb}
      open={open}
    >
      <summary className={summaryClassName} data-title={title} role='button'>
        {summary}
      </summary>
      {children}
    </details>
  )
}
