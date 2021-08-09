import type {FileSystemHandle} from 'browser-fs-access'

import {BubbleCardElement} from '../bubble-card-element/bubble-card-element'
import {
  addDividerAction,
  loadTableFileAsync,
  newFileAction,
  saveFileAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {IconButtonElement} from '../icon-button-element/icon-button-element'
import {openFile, saveFile} from '../../utils/file-util'
import {serializeTable} from '../../table-serializer/table-serializer'
import {t} from '@lingui/macro'
import {UnorderedListElement} from '../unordered-list-element/unordered-list-element'
import {useAppSelector, useAppDispatch} from '../../hooks/use-store'
import {useCallback, useState} from 'react'
import {ActionCreators} from 'redux-undo'

import addDividerIcon from '../../icons/add-divider-icon.svg'
import helpIcon from '../../icons/help-icon.svg'
import loadFileIcon from '../../icons/load-file-icon.svg'
import newFileIcon from '../../icons/new-file-icon.svg'
import redoIcon from '../../icons/redo-icon.svg'
import saveFileIcon from '../../icons/save-file-icon.svg'
import saveFileAsIcon from '../../icons/save-file-as-icon.svg'
import undoIcon from '../../icons/undo-icon.svg'

import './toolbar-element.css'

export function ToolbarCardElement() {
  return (
    <div className='toolbar-card'>
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
    dispatch(ActionCreators.undo())
  }, [dispatch])
  const onRedoClick = useCallback(() => {
    dispatch(ActionCreators.redo())
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
    let fileHandle
    try {
      fileHandle = await openFile()
    } catch (err) {
      if (isCanceledByUser(err)) return
      throw err
    }
    setFileSystemHandle(fileHandle.handle)
    dispatch(
      loadTableFileAsync({
        fileHandle,
        idFactory: tableState.idFactory
      })
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
          src={undoIcon}
          title={t`button-undo__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-redo__access-key`}
          label={t`button-redo__label`}
          onClick={onRedoClick}
          src={redoIcon}
          title={t`button-redo__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-save-file__access-key`}
          label={t`button-save-file__label`}
          onClick={onSaveClick}
          src={saveFileIcon}
          title={t`button-save-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-add-divider__access-key`}
          label={t`button-add-divider__label`}
          onClick={onAddDividerClick}
          src={addDividerIcon}
          title={t`button-add-divider__title`}
        />
      </li>
      <li>
        <IconButtonElement
          label={t`button-save-file-as__label`}
          onClick={onSaveAs}
          src={saveFileAsIcon}
          title={t`button-save-file-as__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-load-file__access-key`}
          label={t`button-load-file__label`}
          onClick={onLoadClick}
          src={loadFileIcon}
          title={t`button-load-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-new-file__access-key`}
          label={t`button-new-file__label`}
          onClick={onNewClick}
          src={newFileIcon}
          title={t`button-new-file__title`}
        />
      </li>
      <li>
        <IconButtonElement
          accessKey={t`button-help__access-key`}
          label={t`button-help__label`}
          onClick={onHelpClick}
          src={helpIcon}
          title={t`button-help__title`}
        />
      </li>
    </UnorderedListElement>
  )
}

function isCanceledByUser(err: unknown): boolean {
  return err instanceof DOMException && err.code === err.ABORT_ERR
}
