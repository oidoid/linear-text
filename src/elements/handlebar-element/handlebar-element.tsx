import type {DraggableProvidedDragHandleProps} from 'react-beautiful-dnd'

import {IconElement} from '../icon-element/icon-element'

import grabIcon from '../../icons/grab-icon.svg'

import './handlebar-element.css'

export type HandlebarProps = Readonly<{
  dragHandleProps: DraggableProvidedDragHandleProps | undefined
}>

export function HandlebarElement({dragHandleProps}: HandlebarProps) {
  return (
    <div className='handlebar' {...dragHandleProps}>
      <IconElement
        alt=''
        src={grabIcon}
        title='Press or spacebar to grab line.'
      />
    </div>
  )
}
