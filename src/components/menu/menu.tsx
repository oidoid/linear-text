import {Button} from '../button/button'
import {Card} from '../card/card'
import {ListItem} from '../list-item/list-item'
import {t} from '@lingui/macro'
import {Trans} from '@lingui/react'
import {UnorderedList} from '../unordered-list/unordered-list'

import './menu.css'

export function MenuCard() {
  return (
    <div className='menu-card'>
      <Card>
        <Menu />
      </Card>
    </div>
  )
}

export function Menu() {
  return (
    <nav>
      <MenuList />
    </nav>
  )
}

export function MenuList() {
  return (
    <UnorderedList horizontal>
      <ListItem>
        <Button title={t`button-toggle-menu__title`}>
          <Trans id='button-toggle-menu__label' />
        </Button>
      </ListItem>
      <ListItem>
        <Button title={t`button-new-row__title`}>
          <Trans id='button-new-row__label' />
        </Button>
      </ListItem>
      <ListItem>
        <Button title={t`button-remove-row__title`}>
          <Trans id='button-remove-row__label' />
        </Button>
      </ListItem>
    </UnorderedList>
  )
}
