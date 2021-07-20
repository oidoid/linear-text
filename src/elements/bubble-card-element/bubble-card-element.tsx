import type {CardElementProps} from '../card-element/card-element'
import {CardElement} from '../card-element/card-element'

import './bubble-card-element.css'

export function BubbleCardElement(props: CardElementProps): JSX.Element {
  return (
    <div className='bubble-card-element'>
      <CardElement {...props} />
    </div>
  )
}
