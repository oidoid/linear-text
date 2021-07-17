import type {FileWithHandle} from 'browser-fs-access'

import {BubbleCard} from '../bubble-card/bubble-card'
import {
  loadTabFileAsync,
  newFile,
  selectRecords,
  setFocus
} from '../../store/records/records-slice'
import {IconButton} from '../icon-button/icon-button'
import {ListItem} from '../list-item/list-item'
import {openFile} from '../../file-io/file-io'
import {t} from '@lingui/macro'
import {UnorderedList} from '../unordered-list/unordered-list'
import {useAppSelector, useAppDispatch} from '../../hooks/use-store'
import {useEffect, useState} from 'react'

import toolbarIconHelp from './toolbar-icon-help.svg'
import toolbarIconLoadFile from './toolbar-icon-load-file.svg'
import toolbarIconNewFile from './toolbar-icon-new-file.svg'
import toolbarIconRedo from './toolbar-icon-redo.svg'
import toolbarIconSaveFile from './toolbar-icon-save-file.svg'
import toolbarIconSaveFileAs from './toolbar-icon-save-file-as.svg'
import toolbarIconUndo from './toolbar-icon-undo.svg'

import './toolbar.css'

export function ToolbarCard() {
  return (
    <div className='toolbar-card'>
      <BubbleCard>
        <Toolbar />
      </BubbleCard>
    </div>
  )
}

export function Toolbar() {
  const [file, setFile] = useState<FileWithHandle>()
  const records = useAppSelector(selectRecords)
  const dispatch = useAppDispatch()

  console.log(file)
  useEffect(() => console.log(JSON.stringify(records)), [records])

  return (
    <UnorderedList layout='grid'>
      <ListItem>
        <IconButton
          label={t`button-undo__label`}
          onClick={() => {
            throw Error('Undo unimplemented.')
          }}
          src={toolbarIconUndo}
          title={t`button-undo__title`}
        />
      </ListItem>
      <ListItem>
        <IconButton
          label={t`button-redo__label`}
          onClick={() => {
            throw Error('Redo unimplemented.')
          }}
          src={toolbarIconRedo}
          title={t`button-redo__title`}
        />
      </ListItem>
      <ListItem>
        <IconButton
          label={t`button-save-file__label`}
          onClick={() => {
            throw Error('Save unimplemented.')
          }}
          src={toolbarIconSaveFile}
          title={t`button-save-file__title`}
        />
      </ListItem>
      <ListItem>
        <IconButton
          label={t`button-save-file-as__label`}
          onClick={() => {
            throw Error('Save as unimplemented.')
          }}
          src={toolbarIconSaveFileAs}
          title={t`button-save-file-as__title`}
        />
      </ListItem>
      <ListItem>
        <IconButton
          label={t`button-load-file__label`}
          onClick={async () => {
            const result = await openFile('Pick records file')
            setFile(result)
            dispatch(loadTabFileAsync({factory: records.factory, file: result}))
          }}
          src={toolbarIconLoadFile}
          title={t`button-load-file__title`}
        />
      </ListItem>
      <ListItem>
        <IconButton
          label={t`button-new-file__label`}
          onClick={() => dispatch(newFile())}
          src={toolbarIconNewFile}
          title={t`button-new-file__title`}
        />
      </ListItem>
      <ListItem>
        <IconButton
          label={t`button-help__label`}
          onClick={() => {
            if (records.tab.records.length === 0) return
            const index = Math.trunc(Math.random() * records.tab.records.length)
            dispatch(setFocus(index))
            // throw Error('Help unimplemented.')
          }}
          src={toolbarIconHelp}
          title={t`button-help__title`}
        />
      </ListItem>
    </UnorderedList>
  )
}
