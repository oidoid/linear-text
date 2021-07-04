import type {CardProps} from '../card/card'
import {Card} from '../card/card'

import './bubble-card.css'

export function BubbleCard(props: CardProps) {
  return (
    <div className='bubble-card'>
      <Card {...props} />
    </div>
  )
}
