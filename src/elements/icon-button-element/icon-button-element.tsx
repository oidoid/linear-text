import type {MouseEventHandler} from 'react'

import {ButtonElement} from '../button-element/button-element'
import {IconElement} from '../icon-element/icon-element'

import './icon-button-element.css'

export type IconButtonProps = Readonly<{
  accessKey?: string | undefined
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  src: string
  title: string
}>

export function IconButtonElement({
  accessKey,
  label,
  onClick,
  src,
  title
}: IconButtonProps): JSX.Element {
  return (
    <div className='icon-button-element'>
      <ButtonElement accessKey={accessKey} onClick={onClick} title={title}>
        <IconElement alt='' src={src} />
      </ButtonElement>
      <label className='icon-buttonish-element__label'>{label}</label>
    </div>
  )
}
