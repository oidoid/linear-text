import type {FileSystemHandle} from 'browser-fs-access'

import {BubbleCardElement} from '../bubble-card-element/bubble-card-element'
import {
  addDividerAction,
  loadTableFileAsync,
  newFileAction,
  redoAction,
  saveFileAction,
  selectTableState,
  undoAction
} from '../../store/table-slice/table-slice'
import {IconButtonElement} from '../icon-button-element/icon-button-element'
import {openFile, saveFile} from '../../utils/file-util'
import {serializeTable} from '../../table-serializer/table-serializer'
import {t} from '@lingui/macro'
import {UnorderedListElement} from '../unordered-list-element/unordered-list-element'
import {useAppSelector, useAppDispatch} from '../../hooks/use-store'
import {useCallback, useState} from 'react'

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
  const [fileSystemHandle, setFileSystemHandle] = useState<FileSystemHandle>()
  const tableState = useAppSelector(selectTableState)
  const dispatch = useAppDispatch()

  const onUndoClick = useCallback(() => {
    dispatch(undoAction())
  }, [dispatch])
  const onRedoClick = useCallback(() => {
    dispatch(redoAction())
  }, [dispatch])
  const onAddDividerClick = useCallback(() => {
    dispatch(addDividerAction())
  }, [dispatch])
  const save = useCallback(
    async (fileSystemHandle: FileSystemHandle | undefined) => {
      const tabSeparatedValues = serializeTable(tableState.table)
      let handle
      try {
        handle = await saveFile(fileSystemHandle, tabSeparatedValues)
      } catch (err) {
        if (isCanceledByUser(err)) return
        throw err
      }
      setFileSystemHandle(handle)
      dispatch(saveFileAction(handle.name))
    },
    [dispatch, tableState.table]
  )
  const onSaveClick = useCallback(
    async () => save(fileSystemHandle),
    [fileSystemHandle, save]
  )
  const onSaveAs = useCallback(() => save(undefined), [save])
  const onLoadClick = useCallback(async () => {
    let fileWithHandle
    try {
      fileWithHandle = await openFile()
    } catch (err) {
      if (isCanceledByUser(err)) return
      throw err
    }
    setFileSystemHandle(fileWithHandle.handle)
    dispatch(
      loadTableFileAsync({fileWithHandle, idFactory: tableState.idFactory})
    )
  }, [dispatch, tableState.idFactory])
  const onNewClick = useCallback(() => {
    setFileSystemHandle(undefined)
    dispatch(newFileAction())
  }, [dispatch])
  const onHelpClick = useCallback(() => {
    console.error('Help unimplemented.')
  }, [])

  return (
    <UnorderedListElement layout='grid'>
      <li>
        <IconButtonElement
          accessKey={t`button-undo__access-key`}
          label={t`button-undo__label`}
          onClick={onUndoClick}
          src={toolbarIconUndo}
          title={t`button-undo__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-redo__access-key`}
          label={t`button-redo__label`}
          onClick={onRedoClick}
          src={toolbarIconRedo}
          title={t`button-redo__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-save-file__access-key`}
          label={t`button-save-file__label`}
          onClick={onSaveClick}
          src={toolbarIconSaveFile}
          title={t`button-save-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-add-divider__access-key`}
          label={t`button-add-divider__label`}
          onClick={onAddDividerClick}
          src={toolbarIconAddDivider}
          title={t`button-add-divider__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-save-file-as__label`}
          onClick={onSaveAs}
          src={toolbarIconSaveFileAs}
          title={t`button-save-file-as__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-load-file__access-key`}
          label={t`button-load-file__label`}
          onClick={onLoadClick}
          src={toolbarIconLoadFile}
          title={t`button-load-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-new-file__access-key`}
          label={t`button-new-file__label`}
          onClick={onNewClick}
          src={toolbarIconNewFile}
          title={t`button-new-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-help__access-key`}
          label={t`button-help__label`}
          onClick={onHelpClick}
          src={toolbarIconHelp}
          title={t`button-help__title`}
        />
      </li>
    </UnorderedListElement>
  )
}

function isCanceledByUser(err: unknown): boolean {
  return err instanceof DOMException && err.code === err.ABORT_ERR
}
