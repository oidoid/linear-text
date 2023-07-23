import React, {ReactNode, useCallback, useEffect} from 'react'
import {IconButtonElement} from '../button-element/icon-button-element'
import {CardElement} from './card-element'

import dismissIcon from '../../icons/dismiss-icon.svg'

import './dialog-card-element.css'

export type DialogProps = Readonly<{
  children: ReactNode
  /** Fragment identifier for linking. */
  id: string
  label: string
  onDismissClick(): void
}>

export function DialogCardElement({
  children,
  id,
  label,
  onDismissClick
}: DialogProps): JSX.Element {
  const onClickBlock = useCallback((ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation()
  }, [])
  const onEscapeDismiss = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape') return
      ev.stopPropagation()
      onDismissClick()
    },
    [onDismissClick]
  )
  const dismissButton = (
    <IconButtonElement
      label='Dismiss'
      onClick={onDismissClick}
      src={dismissIcon}
      title='Dismiss dialog.'
    />
  )
  useEffect(() => {
    window.addEventListener('keydown', onEscapeDismiss)
    return () => window.removeEventListener('keydown', onEscapeDismiss)
  }, [onEscapeDismiss])
  return (
    <div className='dialog-card' onClick={onDismissClick}>
      <div className='dialog-card__box' onClick={onClickBlock}>
        <CardElement
          headerProps={{actionEnd: dismissButton, id, label, level: 1}}
        >
          {children}
        </CardElement>
      </div>
    </div>
  )
}
