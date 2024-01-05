import { fileOpen, fileSave } from 'npm:browser-fs-access'

export type FileAndHandle = {
  file: File
  handle: FileSystemFileHandle | undefined
}

const defaultExtension: string = '.text'
const defaultMimeType: string = 'text/plain'
const defaultExtensions: readonly string[] = [defaultExtension, '.md', '.txt']

export async function openFile(): Promise<FileAndHandle | undefined> {
  let file
  try {
    file = await fileOpen({
      mimeTypes: [defaultMimeType],
      extensions: [...defaultExtensions],
      description: 'Plain Text Files',
    })
  } catch (err) {
    if (isCanceledByUser(err)) return
    throw err
  }
  return { file, handle: file.handle }
}

export async function reopenFile(
  fileAndHandle: FileAndHandle,
): Promise<FileAndHandle> {
  if (!fileAndHandle.handle) return fileAndHandle
  return {
    file: await fileAndHandle.handle.getFile(),
    handle: fileAndHandle.handle,
  }
}

export function isFileModified(
  before: Readonly<FileAndHandle>,
  after: Readonly<FileAndHandle>,
): boolean {
  return before.file.lastModified < after.file.lastModified
}

export async function saveFile(
  fileAndHandle: FileAndHandle | undefined,
  text: string,
): Promise<FileAndHandle | undefined> {
  let handle
  try {
    handle = await fileSave(
      new Blob([text], { type: defaultMimeType }),
      {
        fileName: fileAndHandle?.file.name ?? `untitled${defaultExtension}`,
        extensions: [...defaultExtensions],
      },
      fileAndHandle?.handle,
    )
  } catch (err) {
    if (isCanceledByUser(err)) {
      // Don't discard existing handle.
      return fileAndHandle
    }
    throw err
  }
  if (!handle) return fileAndHandle
  return { file: await handle.getFile(), handle }
}

function isCanceledByUser(err: unknown): boolean {
  if (!(err instanceof DOMException)) return false
  return (
    // Canceled from system file picker.
    err.name === 'AbortError' ||
    // Canceled from browser file save prompt.
    err.name === 'NotAllowedError'
  )
}
