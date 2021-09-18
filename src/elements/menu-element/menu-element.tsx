import {ActionCreators} from 'redux-undo'
import {
  addGroupAction,
  addDraftAction,
  clearHistoryAction,
  loadTableFileAsync,
  newFileAction,
  removeLineAction,
  removeGroupAction,
  saveFileAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {CardElement} from '../card-element/card-element'
import {
  FileAndHandle,
  isFileModified,
  openFile,
  reopenFile,
  saveFile
} from '../../utils/file-util'
import {HelpDialogCardElement} from '../help-element/help-element'
import {IconButtonElement} from '../button-element/icon-button-element'
import {serializeTable} from '../../table-parser/table-serializer'
import {t} from '@lingui/macro'
import {UnorderedListElement} from '../list-element/list-element'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'
import {useCallback, useEffect, useRef, useState} from 'react'

import addGroupIcon from '../../icons/add-group-icon.svg'
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
      accessKey: t`button-add-line__access-key`,
      label: t`button-add-line__label`,
      onClick: onAddLineClick,
      src: addLineIcon,
      title: t`button-add-line__title`
    },
    {
      accessKey: t`button-add-group__access-key`,
      label: t`button-add-group__label`,
      onClick: onAddGroupClick,
      src: addGroupIcon,
      title: t`button-add-group__title`
    },
    {
      // [to-do]: This handles lines and groups. Fix or update i18n.
      accessKey: t`button-remove-line__access-key`,
      label: t`button-remove-line__label`,
      onClick: onRemoveClick,
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
      accessKey: t`button-load-file__access-key`,
      label: t`button-load-file__label`,
      onClick: onLoadClick,
      src: loadFileIcon,
      title: t`button-load-file__title`
    },
    {
      accessKey: t`button-save-file__access-key`,
      label: t`button-save-file__label`,
      onClick: onSaveClick,
      src: saveFileIcon,
      title: t`button-save-file__title`
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
