import type {MouseEventHandler, ReactNode} from 'react'

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
  return (
    <button
      accessKey={accessKey}
      className={`buttonish ${active ? 'buttonish--active' : ''}`}
      data-testid={testID}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
