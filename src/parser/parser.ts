import type {FileWithHandle} from 'browser-fs-access'

export function parseFile(file: FileWithHandle) {
  return file.text()
}
