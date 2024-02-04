import { TextTree } from '../tree/text-tree.js'

export type Autosave = {
  /** Filename last saved as. */
  readonly filename: string | undefined
  /** Whether all changes have been recorded to disk. */
  readonly saved: boolean
  readonly text: string
  /**
   * Autosave version recorded at save time. Used for unpacking old data if
   * structural changes have been made. Independent of deno.json version.
   */
  readonly version: 1
}

const autosave: string = 'linearText'

export function saveStorage(
  filename: string | undefined,
  saved: boolean,
  tree: Readonly<TextTree>,
): void {
  const save: Autosave = {
    filename,
    saved,
    text: TextTree.toString(tree),
    version: 1,
  }
  localStorage.setItem(autosave, JSON.stringify(save))
}

export function loadStorage(): Autosave | undefined {
  const json = localStorage.getItem(autosave)
  if (!json) return
  // to-do: what to do on parse failure?
  return JSON.parse(json)
}
