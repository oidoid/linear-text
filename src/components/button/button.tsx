import {MouseEventHandler, ReactNode, useMemo} from 'react'

import './button.css'

export type ButtonProps = Readonly<{
  accessKey?: string
  active?: boolean
  children: ReactNode
  'data-testid'?: string
  disabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  title: string
}>

export function Button({
  accessKey,
  children,
  'data-testid': testID,
  disabled,
  active,
  onClick,
  title
}: ButtonProps) {
  const className = useMemo(
    () => `buttonish ${active ? 'buttonish--active' : ''}`,
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
