import {
  fileOpen,
  fileSave,
  FileSystemHandle,
  FileWithHandle
} from 'browser-fs-access'
import {t} from '@lingui/macro'

export const defaultFileExtension = '.tab'
export const defaultFilename = `linear-text${defaultFileExtension}`

export const defaultMimeType: string = 'text/tab-separated-values'

export const supportedMIMETypes: readonly string[] = Object.freeze([
  defaultMimeType,
  'text/csv',
  'text/plain'
])
export const supportedExtensions: readonly string[] = Object.freeze([
  defaultFileExtension,
  '.tsv',
  '.csv',
  '.txt'
])

export function openFile(): Promise<FileWithHandle> {
  return fileOpen({
    mimeTypes: [...supportedMIMETypes],
    extensions: [...supportedExtensions],
    description: t`dropdown-file-type__description`
  })
}

export function saveFile(
  handle: Readonly<FileSystemHandle> | undefined,
  tabSeparatedValues: string
): Promise<FileSystemHandle> {
  return fileSave(
    new Blob([tabSeparatedValues], {type: defaultMimeType}),
    {
      fileName: handle?.name ?? defaultFilename,
      extensions: [...supportedExtensions]
    },
    handle,
    handle != null
  )
}
