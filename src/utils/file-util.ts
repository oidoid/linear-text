import {fileOpen, FileWithHandle} from 'browser-fs-access'
import {t} from '@lingui/macro'

export const supportedMIMETypes: readonly string[] = Object.freeze([
  'text/tab-separated-values',
  'text/csv',
  'text/plain'
])
export const supportedExtensions: readonly string[] = Object.freeze([
  '.tab',
  '.tsv',
  '.csv'
])

export function openFile(): Promise<FileWithHandle> {
  return fileOpen({
    mimeTypes: [...supportedMIMETypes],
    extensions: [...supportedExtensions],
    description: t`dropdown-file-type__description`
  })
}
