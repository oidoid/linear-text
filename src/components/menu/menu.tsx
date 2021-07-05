import {BubbleCard} from '../bubble-card/bubble-card'
import {IconButton} from '../icon-button/icon-button'
import {ListItem} from '../list-item/list-item'
import {t} from '@lingui/macro'
import {UnorderedList} from '../unordered-list/unordered-list'

import menuIconHelp from './menu-icon-help.svg'
import menuIconLoadFile from './menu-icon-load-file.svg'
import menuIconNewFile from './menu-icon-new-file.svg'
import menuIconRedo from './menu-icon-redo.svg'
import menuIconSaveFile from './menu-icon-save-file.svg'
import menuIconSaveFileAs from './menu-icon-save-file-as.svg'
import menuIconUndo from './menu-icon-undo.svg'

import './menu.css'

export function MenuCard() {
  return (
    <div className='menu-card'>
      <BubbleCard>
        <Menu />
      </BubbleCard>
    </div>
  )
}

export function Menu() {
  return (
    <UnorderedList>
      <ListItem>
        <div className='menu__button-group'>
          <IconButton
            label={t`button-undo__label`}
            onClick={() => {}}
            src={menuIconUndo}
            title={t`button-undo__title`}
          />
          <IconButton
            label={t`button-redo__label`}
            onClick={() => {}}
            src={menuIconRedo}
            title={t`button-redo__title`}
          />
        </div>
      </ListItem>
      <ListItem>
        <div className='menu__button-group'>
          <IconButton
            label={t`button-save-file__label`}
            onClick={() => {}}
            src={menuIconSaveFile}
            title={t`button-save-file__title`}
          />
          <IconButton
            label={t`button-save-file-as__label`}
            onClick={() => {}}
            src={menuIconSaveFileAs}
            title={t`button-save-file-as__title`}
          />
        </div>
      </ListItem>
      <ListItem>
        <div className='menu__button-group'>
          <IconButton
            label={t`button-load-file__label`}
            onClick={() => {}}
            src={menuIconLoadFile}
            title={t`button-load-file__title`}
          />
          <IconButton
            label={t`button-new-file__label`}
            onClick={() => {}}
            src={menuIconNewFile}
            title={t`button-new-file__title`}
          />
        </div>
      </ListItem>
      <ListItem>
        <div className='menu__button-group'>
          <IconButton
            label={t`button-help__label`}
            onClick={() => {}}
            src={menuIconHelp}
            title={t`button-help__title`}
          />
        </div>
      </ListItem>
    </UnorderedList>
  )
}
