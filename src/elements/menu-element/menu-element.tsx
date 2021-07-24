import {
  addLineAction,
  removeLineAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {CardElement} from '../card-element/card-element'
import {DisclosureElement} from '../disclosure-element/disclosure-element'
import {IconElement} from '../icon-element/icon-element'
import {IconButtonElement} from '../icon-button-element/icon-button-element'
import {t} from '@lingui/macro'
import {ToolbarCardElement} from '../toolbar-element/toolbar-element'
import {Trans} from '@lingui/react'
import {UnorderedListElement} from '../unordered-list-element/unordered-list-element'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'

import menuIconAddLine from './menu-icon-add-line.svg'
import menuIconRemoveLine from './menu-icon-remove-line.svg'
import menuIconToggleMenu from './menu-icon-toggle-menu.svg'
import menuIconToggleToolbar from './menu-icon-toggle-toolbar.svg'

import './menu-element.css'

export function MenuCardElement(): JSX.Element {
  return (
    <div className='menu-card-element'>
      <CardElement>
        <MenuElement />
      </CardElement>
    </div>
  )
}

function MenuElement(): JSX.Element {
  return (
    <nav className='menu-element'>
      <MenuListElement />
    </nav>
  )
}

function MenuListElement(): JSX.Element {
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)
  return (
    <div className='menu-list-element'>
      <DisclosureElement
        summary={<IconElement alt='' src={menuIconToggleMenu} />}
        title={t`button-toggle-menu__title`}
        open
      >
        <UnorderedListElement layout='horizontal'>
          <li>
            <DisclosureElement
              summary={<IconElement alt='' src={menuIconToggleToolbar} />}
              title={t`button-toggle-toolbar__title`}
            >
              <ToolbarCardElement />
            </DisclosureElement>
            <label className='icon-buttonish-element__label'>
              <Trans id='button-toggle-toolbar__label' />
            </label>
          </li>
          <li>
            <IconButtonElement
              label={t`button-remove-line__label`}
              onClick={ev => {
                ev.stopPropagation()
                if (tableState.focus == null) return
                dispatch(
                  removeLineAction({line: tableState.focus, focus: 'prev'})
                )
              }}
              src={menuIconRemoveLine}
              title={t`button-remove-line__title`}
            />
          </li>
          <li>
            <IconButtonElement
              label={t`button-add-line__label`}
              onClick={() => dispatch(addLineAction('draft'))}
              src={menuIconAddLine}
              title={t`button-add-line__title`}
            />
          </li>
        </UnorderedListElement>
      </DisclosureElement>
    </div>
  )
}
