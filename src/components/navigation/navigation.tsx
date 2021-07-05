import {Card} from '../card/card'
import {Disclosure} from '../disclosure/disclosure'
import {Icon} from '../icon/icon'
import {IconButton} from '../icon-button/icon-button'
import {ListItem} from '../list-item/list-item'
import {MenuCard} from '../menu/menu'
import {t} from '@lingui/macro'
import {Trans} from '@lingui/react'
import {UnorderedList} from '../unordered-list/unordered-list'

import navigationIconAddRecord from './navigation-icon-add-record.svg'
import navigationIconRemoveRecord from './navigation-icon-remove-record.svg'
import navigationIconToggleMenu from './navigation-icon-toggle-menu.svg'

import './navigation.css'

export function NavigationCard() {
  return (
    <div className='navigation-card'>
      <Card>
        <Navigation />
      </Card>
    </div>
  )
}

function Navigation() {
  return (
    <nav className='navigation'>
      <NavigationList />
    </nav>
  )
}

function NavigationList() {
  return (
    <div className='navigation-list'>
      <UnorderedList horizontal>
        <ListItem>
          <Disclosure
            summary={<Icon alt='' src={navigationIconToggleMenu} />}
            title={t`button-toggle-menu__title`}
          >
            <MenuCard />
          </Disclosure>
          <label className='icon-buttonish__label'>
            <Trans id='button-toggle-menu__label' />
          </label>
        </ListItem>
        <ListItem>
          <IconButton
            label={t`button-remove-record__label`}
            onClick={() => {}}
            src={navigationIconRemoveRecord}
            title={t`button-remove-record__title`}
          />
        </ListItem>
        <ListItem>
          <IconButton
            label={t`button-add-record__label`}
            onClick={() => {}}
            src={navigationIconAddRecord}
            title={t`button-add-record__title`}
          />
        </ListItem>
      </UnorderedList>
    </div>
  )
}
