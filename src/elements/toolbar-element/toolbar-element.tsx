import type {FileWithHandle} from 'browser-fs-access'

import {BubbleCardElement} from '../bubble-card-element/bubble-card-element'
import {
  addLineAction,
  loadTableFileAsync,
  newFileAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {IconButtonElement} from '../icon-button-element/icon-button-element'
import {openFile} from '../../utils/file-util'
import {t} from '@lingui/macro'
import {UnorderedListElement} from '../unordered-list-element/unordered-list-element'
import {useAppSelector, useAppDispatch} from '../../hooks/use-store'
import {useEffect, useState} from 'react'

import toolbarIconAddDivider from './toolbar-icon-add-divider.svg'
import toolbarIconHelp from './toolbar-icon-help.svg'
import toolbarIconLoadFile from './toolbar-icon-load-file.svg'
import toolbarIconNewFile from './toolbar-icon-new-file.svg'
import toolbarIconRedo from './toolbar-icon-redo.svg'
import toolbarIconSaveFile from './toolbar-icon-save-file.svg'
import toolbarIconSaveFileAs from './toolbar-icon-save-file-as.svg'
import toolbarIconUndo from './toolbar-icon-undo.svg'

import './toolbar-element.css'

export function ToolbarCardElement() {
  return (
    <div className='toolbar-card-element'>
      <BubbleCardElement>
        <ToolbarElement />
      </BubbleCardElement>
    </div>
  )
}

export function ToolbarElement(): JSX.Element {
  const [file, setFile] = useState<FileWithHandle>()
  const tableState = useAppSelector(selectTableState)
  const dispatch = useAppDispatch()

  useEffect(() => console.log(file), [file])
  return (
    <UnorderedListElement layout='grid'>
      <li>
        <IconButtonElement
          label={t`button-undo__label`}
          onClick={() => {
            throw Error('Undo unimplemented.')
          }}
          src={toolbarIconUndo}
          title={t`button-undo__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-redo__label`}
          onClick={() => {
            throw Error('Redo unimplemented.')
          }}
          src={toolbarIconRedo}
          title={t`button-redo__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-save-file__label`}
          onClick={() => {
            throw Error('Save unimplemented.')
          }}
          src={toolbarIconSaveFile}
          title={t`button-save-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-add-divider__label`}
          onClick={() => {
            dispatch(addLineAction('divider'))
          }}
          src={toolbarIconAddDivider}
          title={t`button-add-divider__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-save-file-as__label`}
          onClick={() => {
            throw Error('Save as unimplemented.')
          }}
          src={toolbarIconSaveFileAs}
          title={t`button-save-file-as__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-load-file__label`}
          onClick={async () => {
            const result = await openFile()
            setFile(result)
            dispatch(
              loadTableFileAsync({
                idFactory: tableState.idFactory,
                file: result
              })
            )
          }}
          src={toolbarIconLoadFile}
          title={t`button-load-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-new-file__label`}
          onClick={() => {
            setFile(undefined)
            dispatch(newFileAction())
          }}
          src={toolbarIconNewFile}
          title={t`button-new-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-help__label`}
          onClick={() => {
            throw Error('Help unimplemented.')
          }}
          src={toolbarIconHelp}
          title={t`button-help__title`}
        />
      </li>
    </UnorderedListElement>
  )
}
