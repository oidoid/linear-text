import {
  addRecord,
  removeRecord,
  selectRecords
} from '../../store/records/records-slice'
import {Card} from '../card/card'
import {Disclosure} from '../disclosure/disclosure'
import {Icon} from '../icon/icon'
import {IconButton} from '../icon-button/icon-button'
import {ListItem} from '../list-item/list-item'
import {t} from '@lingui/macro'
import {TabRecord} from '../../tab/tab-record'
import {ToolbarCard} from '../toolbar/toolbar'
import {Trans} from '@lingui/react'
import {UnorderedList} from '../unordered-list/unordered-list'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'

import navigationIconAddRecord from './navigation-icon-add-record.svg'
import navigationIconRemoveRecord from './navigation-icon-remove-record.svg'
import navigationIconToggleToolbar from './navigation-icon-toggle-toolbar.svg'

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
  const dispatch = useAppDispatch()
  const records = useAppSelector(selectRecords)
  return (
    <div className='navigation-list'>
      <UnorderedList horizontal>
        <ListItem>
          <Disclosure
            summary={<Icon alt='' src={navigationIconToggleToolbar} />}
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
            label={t`button-remove-record__label`}
            onClick={() => {
              if (records.focusedRecordIndex == null) return
              dispatch(removeRecord(records.focusedRecordIndex))
            }}
            src={navigationIconRemoveRecord}
            title={t`button-remove-record__title`}
          />
        </ListItem>
        <ListItem>
          <IconButton
            label={t`button-add-record__label`}
            onClick={() => dispatch(addRecord(TabRecord()))}
            src={navigationIconAddRecord}
            title={t`button-add-record__title`}
          />
        </ListItem>
      </UnorderedList>
    </div>
  )
}
