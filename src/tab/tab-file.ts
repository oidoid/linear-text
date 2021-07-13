import type {TabColumnMap, TabRecord, TabRow} from './tab-record'

export type TabFile = Readonly<{meta: TabMeta; records: TabRecord[]}>

export type TabMeta = Readonly<{
  header: TabHeader | undefined
  /** If header is not present, this will be inferred from the data. */
  columnMap: TabColumnMap
  delimiter: string
  newline: string
}>

/**
 * If present, this will be serialized and used to infer column map. This
 * can't currently be modified by the program.
 */
export type TabHeader = TabRow

export function TabFile(): TabFile {
  return {meta: TabMeta(), records: []}
}

export function TabMeta(): TabMeta {
  return {columnMap: {}, ...tabMetaDefaults}
}

export const tabMetaDefaults = Object.freeze({
  header: undefined,
  delimiter: '\t',
  newline: '\n'
})
