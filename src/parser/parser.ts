import type {FileWithHandle} from 'browser-fs-access'
import {TabRecord} from '../tab-record'

export async function parseFile(file: FileWithHandle): Promise<TabRecord[]> {
  const text = await file.text()
  return [TabRecord(text)]
}
