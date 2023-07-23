import {useCallback, useEffect, useRef, useState} from 'react'
import {ActionCreators} from 'redux-undo'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'
import {
  addDraftAction,
  addGroupAction,
  clearHistoryAction,
  loadTableFileAsync,
  newFileAction,
  removeGroupAction,
  removeLineAction,
  saveFileAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {serializeTable} from '../../table-parser/table-serializer'
import {
  FileAndHandle,
  isFileModified,
  openFile,
  reopenFile,
  saveFile
} from '../../utils/file-util'
import {IconButtonElement} from '../button-element/icon-button-element'
import {CardElement} from '../card-element/card-element'
import {HelpDialogCardElement} from '../help-element/help-element'
import {UnorderedListElement} from '../list-element/list-element'

import addGroupIcon from '../../icons/add-group-icon.svg'
import addLineIcon from '../../icons/add-line-icon.svg'
import helpIcon from '../../icons/help-icon.svg'
import loadFileIcon from '../../icons/load-file-icon.svg'
import newFileIcon from '../../icons/new-file-icon.svg'
import redoIcon from '../../icons/redo-icon.svg'
import removeLineIcon from '../../icons/remove-line-icon.svg'
import saveFileAsIcon from '../../icons/save-file-as-icon.svg'
import saveFileIcon from '../../icons/save-file-icon.svg'
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
  const fileAndHandle = useRef<FileAndHandle>()

  const onAddLineClick = useCallback(
    () => dispatch(addDraftAction()),
    [dispatch]
  )
  const onUndoClick = useCallback(
    () => dispatch(ActionCreators.undo()),
    [dispatch]
  )
  const onRedoClick = useCallback(
    () => dispatch(ActionCreators.redo()),
    [dispatch]
  )
  const onAddGroupClick = useCallback(
    () => dispatch(addGroupAction()),
    [dispatch]
  )
  const onRemoveClick = useCallback(() => {
    if (tableState.focus == null) return
    if ('y' in tableState.focus)
      dispatch(
        removeLineAction({lineIndex: tableState.focus, nextFocus: 'next'})
      )
    else
      dispatch(
        removeGroupAction({lineIndex: tableState.focus, nextFocus: 'next'})
      )
  }, [dispatch, tableState.focus])
  const save = useCallback(
    async (newFileAndHandle: FileAndHandle | undefined) => {
      const doc = serializeTable(tableState.table)
      try {
        fileAndHandle.current = await saveFile(newFileAndHandle, doc)
      } catch (err) {
        if (isCanceledByUser(err)) return
        throw err
      }
      dispatch(saveFileAction(fileAndHandle.current?.[0].name))
    },
    [dispatch, tableState.table]
  )
  const onSaveClick = useCallback(
    async () => save(fileAndHandle.current),
    [save]
  )
  const onSaveAs = useCallback(() => save(undefined), [save])
  const load = useCallback(
    async (newFileAndHandle: FileAndHandle) => {
      fileAndHandle.current = newFileAndHandle
      dispatch(
        loadTableFileAsync({
          fileAndHandle: newFileAndHandle,
          idFactory: tableState.idFactory
        })
      )
    },
    [dispatch, tableState.idFactory]
  )
  const onLoadClick = useCallback(async () => {
    let newFileAndHandle
    try {
      newFileAndHandle = await openFile()
    } catch (err) {
      if (isCanceledByUser(err)) return
      throw err
    }
    load(newFileAndHandle)
  }, [load])
  const onFocus = useCallback(async () => {
    if (tableState.invalidated) return
    if (fileAndHandle.current == null) return

    // If we have a handle, we can check the timestamp of the current snapshot
    // against a new opened snapshot to determine whether to reload.
    const newFileAndHandle = await reopenFile(fileAndHandle.current)
    if (
      newFileAndHandle != null &&
      !isFileModified(fileAndHandle.current, newFileAndHandle)
    )
      return

    // If we don't have a handle, snapshots are probably unsupported so just
    // reload the current file.
    load(newFileAndHandle == null ? fileAndHandle.current : newFileAndHandle)
  }, [load, tableState.invalidated])
  const onNewClick = useCallback(() => {
    fileAndHandle.current = undefined
    dispatch(newFileAction())
    dispatch(clearHistoryAction())
  }, [dispatch])

  const entries = [
    {
      accessKey: '+',
      label: 'Add',
      onClick: onAddLineClick,
      src: addLineIcon,
      title: 'Add new line [alt–+].'
    },
    {
      accessKey: '|',
      label: 'Group',
      onClick: onAddGroupClick,
      src: addGroupIcon,
      title: 'Add group [alt–|].'
    },
    {
      // [to-do]: This handles lines and groups.
      accessKey: '-',
      label: 'Discard',
      onClick: onRemoveClick,
      src: removeLineIcon,
      title: 'Remove selected line(s) [alt–-].'
    },
    {
      accessKey: 'z',
      label: 'Undo',
      onClick: onUndoClick,
      src: undoIcon,
      title: 'Restore the previous state [alt–z].'
    },
    {
      accessKey: 'y',
      label: 'Redo',
      onClick: onRedoClick,
      src: redoIcon,
      title: 'Reverse an undo [alt–y].'
    },
    {
      accessKey: 'o',
      label: 'Open…',
      onClick: onLoadClick,
      src: loadFileIcon,
      title: 'Load an existing file [alt–o].'
    },
    {
      accessKey: 's',
      label: 'Save',
      onClick: onSaveClick,
      src: saveFileIcon,
      title: 'Download file [alt–s].'
    },
    {
      label: 'Save As…',
      onClick: onSaveAs,
      src: saveFileAsIcon,
      title: 'Open save dialog.'
    },
    {
      accessKey: 'n',
      label: 'New',
      onClick: onNewClick,
      src: newFileIcon,
      title: 'Create an empty file [alt–n].'
    },
    {
      accessKey: '?',
      label: 'Help…',
      onClick: toggleHelp,
      src: helpIcon,
      title: 'Open documentation [alt–?].'
    }
  ]

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [onFocus])

  return (
    <>
      <nav className='menu'>
        <UnorderedListElement className='menu__list'>
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
        </UnorderedListElement>
      </nav>
      {showHelp && <HelpDialogCardElement onDismissClick={toggleHelp} />}
    </>
  )
}

function isCanceledByUser(err: unknown): boolean {
  return err instanceof DOMException && err.code === err.ABORT_ERR
}
