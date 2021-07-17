import {
  addLine,
  removeLine,
  selectTableState
} from '../../store/table-slice/table-slice'
import {Card} from '../card/card'
import {Disclosure} from '../disclosure/disclosure'
import {Icon} from '../icon/icon'
import {IconButton} from '../icon-button/icon-button'
import {ListItem} from '../list-item/list-item'
import {t} from '@lingui/macro'
import {ToolbarCard} from '../toolbar/toolbar'
import {Trans} from '@lingui/react'
import {UnorderedList} from '../unordered-list/unordered-list'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'

import menuIconAddLine from './menu-icon-add-line.svg'
import menuIconRemoveLine from './menu-icon-remove-line.svg'
import menuIconToggleToolbar from './menu-icon-toggle-toolbar.svg'

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

function Menu() {
  return (
    <nav className='menu'>
      <MenuList />
    </nav>
  )
}

function MenuList() {
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)
  return (
    <div className='menu-list'>
      <UnorderedList layout='horizontal'>
        <ListItem>
          <Disclosure
            summary={<Icon alt='' src={menuIconToggleToolbar} />}
            title={t`button-toggle-toolbar__title`}
          >
            <ToolbarCard />
          </Disclosure>
          <label className='icon-buttonish__label'>
            <Trans id='button-toggle-toolbar__label' />
          </label>
        </ListItem>
        <ListItem>
          <IconButton
            label={t`button-remove-line__label`}
            onClick={() => {
              if (tableState.focusedLineIndex == null) return
              dispatch(removeLine(tableState.focusedLineIndex))
            }}
            src={menuIconRemoveLine}
            title={t`button-remove-line__title`}
          />
        </ListItem>
        <ListItem>
          <IconButton
            label={t`button-add-line__label`}
            onClick={() => dispatch(addLine())}
            src={menuIconAddLine}
            title={t`button-add-line__title`}
          />
        </ListItem>
      </UnorderedList>
    </div>
  )
}
