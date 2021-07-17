import {fileOpen} from 'browser-fs-access'
import {t} from '@lingui/macro'

export const supportedMIMETypes = Object.freeze([
  'text/tab-separated-values',
  'text/csv',
  'text/plain'
])
export const supportedExtensions = Object.freeze(['.tab', '.tsv', '.csv'])

export function openFile() {
  return fileOpen({
    mimeTypes: [...supportedMIMETypes],
    extensions: [...supportedExtensions],
    description: t`dropdown-file-type__description`
  })
}
