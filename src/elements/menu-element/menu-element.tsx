import {
  addDraftAction,
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

import addLineIcon from '../../icons/add-line-icon.svg'
import removeLineIcon from '../../icons/remove-line-icon.svg'
import toggleMenuIcon from '../../icons/toggle-menu-icon.svg'
import toggleToolbarIcon from '../../icons/toggle-toolbar-icon.svg'

import './menu-element.css'

export function MenuCardElement(): JSX.Element {
  return (
    <div className='menu-card'>
      <CardElement>
        <MenuElement />
      </CardElement>
    </div>
  )
}

function MenuElement(): JSX.Element {
  return (
    <nav className='menu'>
      <MenuListElement />
    </nav>
  )
}

function MenuListElement(): JSX.Element {
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)
  return (
    <div className='menu-list'>
      <DisclosureElement
        accessKey={t`button-toggle-menu__access-key`}
        summary={<IconElement alt='' src={toggleMenuIcon} />}
        title={t`button-toggle-menu__title`}
        open
      >
        <UnorderedListElement layout='horizontal'>
          <li>
            <DisclosureElement
              accessKey={t`button-toggle-toolbar__access-key`}
              summary={<IconElement alt='' src={toggleToolbarIcon} />}
              title={t`button-toggle-toolbar__title`}
            >
              <ToolbarCardElement />
            </DisclosureElement>
            <label className='icon-buttonish__label'>
              <Trans id='button-toggle-toolbar__label' />
            </label>
          </li>
          <li>
            <IconButtonElement
              accessKey={t`button-remove-line__access-key`}
              label={t`button-remove-line__label`}
              onClick={ev => {
                ev.stopPropagation()
                if (tableState.focus == null) return
                dispatch(
                  removeLineAction({id: tableState.focus, nextFocus: 'prev'})
                )
              }}
              src={removeLineIcon}
              title={t`button-remove-line__title`}
            />
          </li>
          <li>
            <IconButtonElement
              accessKey={t`button-add-line__access-key`}
              label={t`button-add-line__label`}
              onClick={() => dispatch(addDraftAction())}
              src={addLineIcon}
              title={t`button-add-line__title`}
            />
          </li>
        </UnorderedListElement>
      </DisclosureElement>
    </div>
  )
}
