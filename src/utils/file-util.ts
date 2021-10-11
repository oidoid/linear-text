import {fileOpen, fileSave, FileSystemHandle} from 'browser-fs-access'
import {t} from '@lingui/macro'

export type FileSystemFileHandle = {getFile(): Promise<File>} & FileSystemHandle
export type FileAndHandle = [File, FileSystemFileHandle | undefined]

export const defaultTextFileExtension: string = '.txt'
export const commonTextFileExtensions: readonly string[] = Object.freeze([
  defaultTextFileExtension,
  '.text'
])
export const defaultFilename: string = `linear-text${defaultTextFileExtension}`
export const defaultMimeType: string = 'text/plain'

export async function openFile(): Promise<FileAndHandle> {
  const fileWithHandle = await fileOpen({
    mimeTypes: [defaultMimeType],
    extensions: [defaultTextFileExtension, '.text'],
    description: t`dropdown-file-type__description`
  })
  return [
    fileWithHandle,
    fileWithHandle.handle as FileSystemFileHandle | undefined
  ]
}

export async function reopenFile([, handle]: FileAndHandle): Promise<
  FileAndHandle | undefined
> {
  return handle == null ? undefined : [await handle.getFile(), handle]
}

export function isFileModified(
  [before]: Readonly<FileAndHandle>,
  [after]: Readonly<FileAndHandle>
): boolean {
  return before.lastModified < after.lastModified
}

export async function saveFile(
  fileAndHandle: FileAndHandle | undefined,
  doc: string
): Promise<FileAndHandle | undefined> {
  const newHandle = (await fileSave(
    new Blob([doc], {type: defaultMimeType}),
    {
      fileName: fileAndHandle?.[0].name ?? defaultFilename,
      extensions: [defaultTextFileExtension]
    },
    fileAndHandle?.[1],
    fileAndHandle?.[1] != null
  )) as FileSystemFileHandle | undefined
  if (newHandle == null) return fileAndHandle
  return [await newHandle.getFile(), newHandle]
}
