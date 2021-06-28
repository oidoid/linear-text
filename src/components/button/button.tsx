import type {MouseEventHandler, ReactNode} from 'react'

import './button.css'

export type ButtonProps = Readonly<{
  accessKey?: string
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
  onClick,
  title
}: ButtonProps) {
  return (
    <button
      accessKey={accessKey}
      data-testid={testID}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className='button'
    >
      {children}
    </button>
  )
}
