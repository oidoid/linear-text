import {fileOpen} from 'browser-fs-access'

export const supportedMIMETypes = Object.freeze([
  'text/tab-separated-values',
  'text/csv',
  'text/plain'
])
export const supportedExtensions = Object.freeze(['.tab', '.tsv', '.csv'])

export function openFile(description: string) {
  return fileOpen({
    mimeTypes: [...supportedMIMETypes],
    extensions: [...supportedExtensions],
    description
  })
}
