import type {Line} from '../../line/line'
import type {XY} from '../../math/xy'

import {
  HandlebarElement,
  HandlebarProps
} from '../handlebar-element/handlebar-element'
import {parseObjectURL} from '../../uri-parser/uri-parser'
import {useMemo} from 'react'

import './line-image-element.css'

export type LineImageProps = Readonly<
  {line: Readonly<Line>; xy: Readonly<XY>} & HandlebarProps
>

export function LineImageElement({
  dragHandleProps,
  line
}: LineImageProps): JSX.Element {
  const uri = useMemo(() => line.text.trim(), [line.text])
  const href = useMemo(() => parseObjectURL(uri), [uri])

  return (
    <div className='line-image'>
      <HandlebarElement dragHandleProps={dragHandleProps} />
      <a href={href} rel='noreferrer' target='_blank'>
        <img
          alt={uri}
          className='line-image__image'
          draggable={false}
          src={uri}
          title={uri}
        />
      </a>
    </div>
  )
}
