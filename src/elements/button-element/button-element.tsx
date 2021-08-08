import type {MouseEventHandler, ReactNode} from 'react'

import {useMemo} from 'react'

import './button-element.css'

export type ButtonProps = Readonly<{
  accessKey?: string | undefined
  active?: boolean | undefined
  children: ReactNode
  'data-testid'?: string
  disabled?: boolean | undefined
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
}: ButtonProps): JSX.Element {
  const className = useMemo(
    () => `buttonish ${active ? 'buttonish--active' : ''}`,
    [active]
  )
  return (
    <button
      accessKey={accessKey}
      className={className}
      data-testid={testID}
      data-title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
