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
    () => `button ${active ? 'button--active' : ''}`,
    [active]
  )
  return (
    <button
      {...(accessKey === undefined ? undefined : {accessKey: accessKey})}
      data-testid={testID}
      {...(disabled === undefined ? undefined : {disabled: disabled})}
      onClick={onClick}
      title={title}
      className={className}
    >
      {children}
    </button>
  )
}
