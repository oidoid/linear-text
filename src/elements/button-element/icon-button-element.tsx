import type {MouseEventHandler} from 'react'

import {ButtonElement} from './button-element'
import {IconElement} from '../icon-element/icon-element'

import './icon-button-element.css'

export type IconButtonProps = Readonly<{
  accessKey?: string | undefined
  disabled?: boolean
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  src: string
  title: string
  hideLabel?: true
}>

export function IconButtonElement({
  accessKey,
  disabled,
  label,
  onClick,
  src,
  title,
  hideLabel
}: IconButtonProps): JSX.Element {
  return (
    <div className='icon-button'>
      <ButtonElement
        accessKey={accessKey}
        disabled={disabled}
        onClick={onClick}
        title={title}
      >
        <IconElement alt='' src={src} />
      </ButtonElement>
      <label
        className={`icon-buttonish__label ${
          hideLabel ? 'icon-buttonish__label--hide' : ''
        }`}
      >
        {label}
      </label>
    </div>
  )
}
