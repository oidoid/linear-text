import {CardElement} from '../card-element/card-element'
import {IconButtonElement} from '../icon-button-element/icon-button-element'
import React, {ReactNode, useCallback, useEffect} from 'react'
import {t} from '@lingui/macro'

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
      label={t`button-dismiss-dialog__label`}
      onClick={onDismissClick}
      src={dismissIcon}
      title={t`button-dismiss-dialog__title`}
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
