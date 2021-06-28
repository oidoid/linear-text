import {Button} from '../button/button'
import {Card} from '../card/card'
import {t} from '@lingui/macro'
import {Trans} from '@lingui/react'

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
    <ul className='nav__button-list'>
      <li className='nav__button-item'>
        <Button title={t`button-toggle-menu__title`}>
          <Trans id='button-toggle-menu__label' />
        </Button>
      </li>
      <li>
        <Button title={t`button-new-row__title`}>
          <Trans id='button-new-row__label' />
        </Button>
      </li>
      <li>
        <Button title={t`button-remove-row__title`}>
          <Trans id='button-remove-row__label' />
        </Button>
      </li>
    </ul>
  )
}
