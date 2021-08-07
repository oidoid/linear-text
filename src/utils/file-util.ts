import {
  fileOpen,
  fileSave,
  FileSystemHandle,
  FileWithHandle
} from 'browser-fs-access'
import {t} from '@lingui/macro'

export const defaultFileExtension: string = '.txt'
export const defaultFilename: string = `linear-text${defaultFileExtension}`

export const defaultMimeType: string = 'text/plain'

export function openFile(): Promise<FileWithHandle> {
  return fileOpen({
    mimeTypes: [defaultMimeType],
    extensions: [defaultFileExtension],
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
      extensions: [defaultFileExtension]
    },
    handle,
    handle != null
  )
}
