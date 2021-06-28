import {Button} from '../button/button'
import {Card} from '../card/card'
import {ListItem} from '../list-item/list-item'
import {t} from '@lingui/macro'
import {Trans} from '@lingui/react'
import {UnorderedList} from '../unordered-list/unordered-list'

import './nav.css'

export function NavCard() {
  return (
    <div className='nav-card'>
      <Card>
        <Nav />
      </Card>
    </div>
  )
}

export function Nav() {
  return (
    <nav className='nav'>
      <NavList />
    </nav>
  )
}

export function NavList() {
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
