import type {MouseEventHandler, ReactNode} from 'react'

import {useMemo} from 'react'

import './button-element.css'

export type ButtonElementProps = Readonly<{
  accessKey?: string
  active?: boolean
  children: ReactNode
  'data-testid'?: string
  disabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  title: string
}>

export function ButtonElement({
  accessKey,
  children,
  'data-testid': testID,
  disabled,
  active,
  onClick,
  title
}: ButtonElementProps) {
  const className = useMemo(
    () => `buttonish-element ${active ? 'buttonish-element--active' : ''}`,
    [active]
  )
  return (
    <button
      accessKey={accessKey ?? ''}
      className={className}
      data-testid={testID}
      data-title={title}
      disabled={disabled ?? false}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
