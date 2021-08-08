import {ReactNode, SyntheticEvent, useState} from 'react'

import {useCallback, useMemo} from 'react'

import './disclosure-element.css'

export type DisclosureProps = Readonly<{
  accessKey?: string | undefined
  children: ReactNode
  'data-testid'?: string | undefined
  onToggle?(open: boolean): void
  open?: boolean
  summary: ReactNode
  title: string
}>

export function DisclosureElement({
  accessKey,
  children,
  'data-testid': testID,
  onToggle,
  open: initOpen = false,
  summary,
  title
}: DisclosureProps): JSX.Element {
  const [open, setOpen] = useState(initOpen)

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
      <summary
        accessKey={accessKey}
        className={summaryClassName}
        data-title={title}
        role='button'
      >
        {summary}
      </summary>
      {children}
    </details>
  )
}
