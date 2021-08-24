import type {FileSystemHandle} from 'browser-fs-access'

import {ActionCreators} from 'redux-undo'
import {
  addDividerAction,
  addDraftAction,
  loadTableFileAsync,
  newFileAction,
  removeLineAction,
  saveFileAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {CardElement} from '../card-element/card-element'
import {HelpDialogCardElement} from '../help-element/help-element'
import {IconButtonElement} from '../button-element/icon-button-element'
import {ListElement} from '../list-element/list-element'
import {openFile, saveFile} from '../../utils/file-util'
import {serializeTable} from '../../table-parser/table-serializer'
import {t} from '@lingui/macro'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'
import {useCallback, useState} from 'react'

import addDividerIcon from '../../icons/add-divider-icon.svg'
import addLineIcon from '../../icons/add-line-icon.svg'
import helpIcon from '../../icons/help-icon.svg'
import loadFileIcon from '../../icons/load-file-icon.svg'
import newFileIcon from '../../icons/new-file-icon.svg'
import redoIcon from '../../icons/redo-icon.svg'
import removeLineIcon from '../../icons/remove-line-icon.svg'
import saveFileIcon from '../../icons/save-file-icon.svg'
import saveFileAsIcon from '../../icons/save-file-as-icon.svg'
import undoIcon from '../../icons/undo-icon.svg'

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
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)
  const [showHelp, setShowHelp] = useState(false)
  const toggleHelp = useCallback(() => setShowHelp(showHelp => !showHelp), [])
  const [fileHandle, setFileHandle] = useState<FileSystemHandle>()

  const onAddLineClick = useCallback(
    () => dispatch(addDraftAction()),
    [dispatch]
  )
  const onUndoClick = useCallback(() => {
    dispatch(ActionCreators.undo())
  }, [dispatch])
  const onRedoClick = useCallback(() => {
    dispatch(ActionCreators.redo())
  }, [dispatch])
  const onAddDividerClick = useCallback(() => {
    dispatch(addDividerAction())
  }, [dispatch])
  const onRemoveLineClick = useCallback(() => {
    if (tableState.focus == null) return
    dispatch(removeLineAction({index: tableState.focus, nextFocus: 'prev'}))
  }, [dispatch, tableState.focus])
  const save = useCallback(
    async (fileHandle: FileSystemHandle | undefined) => {
      const doc = serializeTable(tableState.table)
      let handle
      try {
        handle = await saveFile(fileHandle, doc)
      } catch (err) {
        if (isCanceledByUser(err)) return
        throw err
      }
      setFileHandle(handle)
      dispatch(saveFileAction(handle.name))
    },
    [dispatch, tableState.table]
  )
  const onSaveClick = useCallback(
    async () => save(fileHandle),
    [fileHandle, save]
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
    setFileHandle(fileWithHandle.handle)
    dispatch(
      loadTableFileAsync({fileWithHandle, idFactory: tableState.idFactory})
    )
  }, [dispatch, tableState.idFactory])
  const onNewClick = useCallback(() => {
    setFileHandle(undefined)
    dispatch(newFileAction())
  }, [dispatch])

  const entries = [
    {
      accessKey: t`button-add-line__access-key`,
      label: t`button-add-line__label`,
      onClick: onAddLineClick,
      src: addLineIcon,
      title: t`button-add-line__title`
    },
    {
      accessKey: t`button-add-divider__access-key`,
      label: t`button-add-divider__label`,
      onClick: onAddDividerClick,
      src: addDividerIcon,
      title: t`button-add-divider__title`
    },
    {
      accessKey: t`button-remove-line__access-key`,
      label: t`button-remove-line__label`,
      onClick: onRemoveLineClick,
      src: removeLineIcon,
      title: t`button-remove-line__title`
    },
    {
      accessKey: t`button-undo__access-key`,
      label: t`button-undo__label`,
      onClick: onUndoClick,
      src: undoIcon,
      title: t`button-undo__title`
    },
    {
      accessKey: t`button-redo__access-key`,
      label: t`button-redo__label`,
      onClick: onRedoClick,
      src: redoIcon,
      title: t`button-redo__title`
    },
    {
      accessKey: t`button-save-file__access-key`,
      label: t`button-save-file__label`,
      onClick: onSaveClick,
      src: saveFileIcon,
      title: t`button-save-file__title`
    },
    {
      accessKey: t`button-load-file__access-key`,
      label: t`button-load-file__label`,
      onClick: onLoadClick,
      src: loadFileIcon,
      title: t`button-load-file__title`
    },
    {
      label: t`button-save-file-as__label`,
      onClick: onSaveAs,
      src: saveFileAsIcon,
      title: t`button-save-file-as__title`
    },
    {
      accessKey: t`button-new-file__access-key`,
      label: t`button-new-file__label`,
      onClick: onNewClick,
      src: newFileIcon,
      title: t`button-new-file__title`
    },
    {
      accessKey: t`button-help__access-key`,
      label: t`button-help__label`,
      onClick: toggleHelp,
      src: helpIcon,
      title: t`button-help__title`
    }
  ]

  return (
    <>
      <nav className='menu'>
        <ListElement className='menu__list' unordered>
          {entries.map((entry, index) => (
            <li className='menu__list-item' key={index}>
              <IconButtonElement
                accessKey={entry.accessKey}
                label={entry.label}
                onClick={entry.onClick}
                src={entry.src}
                title={entry.title}
              />
            </li>
          ))}
        </ListElement>
      </nav>
      {showHelp && <HelpDialogCardElement onDismissClick={toggleHelp} />}
    </>
  )
}

function isCanceledByUser(err: unknown): boolean {
  return err instanceof DOMException && err.code === err.ABORT_ERR
}
