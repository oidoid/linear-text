import type {ReactNode, SyntheticEvent} from 'react'

import {useBool} from '../../hooks/use-bool'
import {useCallback, useMemo} from 'react'

import './disclosure.css'

export type DisclosureProps = Readonly<{
  children: ReactNode
  'data-testid'?: string
  onToggle?(open: boolean): void
  open?: boolean
  summary: ReactNode
  title: string
}>

export function Disclosure({
  children,
  'data-testid': testID,
  onToggle,
  open: initOpen = false,
  summary,
  title
}: DisclosureProps) {
  const {val: open, set: setOpen} = useBool(initOpen)

  const onToggleCb = useCallback(
    (ev: SyntheticEvent<HTMLDetailsElement>) => {
      setOpen(ev.currentTarget.open)
      onToggle?.(ev.currentTarget.open)
    },
    [onToggle, setOpen]
  )

  const summaryClassName = useMemo(
    () => `disclosure__summary buttonish ${open ? 'buttonish--active' : ''}`,
    [open]
  )

  return (
    <details
      className='disclosure'
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
