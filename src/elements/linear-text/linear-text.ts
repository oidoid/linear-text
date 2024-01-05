import { css, CSSResult, html, LitElement, type TemplateResult } from 'npm:lit'
import { customElement, property } from 'npm:lit/decorators.js'
import {
  type FileAndHandle,
  isFileModified,
  openFile,
  reopenFile,
  saveFile,
} from '../../io/file.ts'
import { loadStorage, saveStorage } from '../../io/storage.ts'
import { type Line, TextTree } from '../../tree/text-tree.ts'
import { cssReset } from '../../utils/css-reset.ts'
import '../app-menu/app-menu.ts'
import { Context } from '../context.ts'
import type { DragEnd } from '../drag-line.ts'
import '../group-list.ts'
import { BlurLine, FocusLine } from '../line-input.ts'
import type { BreakLine, EditLine, ExpandLine } from '../note-card.ts'
import '../split-block.ts'
import '../text-editor.ts'
import { linearTextVars } from './linear-text-vars.ts'
const faviconURI =
  (<{ default: string }> await import('../../favicon/favicon.svg')).default
const faviconUnsavedURI =
  (<{ default: string }> await import('../../favicon/favicon-unsaved.svg'))
    .default

declare global {
  interface HTMLElementTagNameMap {
    'linear-text': LinearText
  }
}

@customElement('linear-text')
export class LinearText extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}
    ${linearTextVars}

    :host {
      display: flex;
      flex-direction: column;
      display: block;

      width: 100%;
      height: 100%;
      overflow: hidden;

      user-select: none;

      font-family: sans-serif;
      font-size: 14px;
      line-height: 1.1;

      background: #006400;
      background-color: black;
    }

    app-menu {
      position: fixed;
      left: 50%;
      bottom: 0;
      translate: -50%;
      /* need spacer so you can click notes at the bottom underneath */
    }

    split-block {
      flex-grow: 1;
      /* to-do: fix with divider which makes this look weird */
      border-width: 1px;
      border-style: solid;
      border-radius: 8px;
      border-color: black;
    }

    group-list {
      display: block;
      width: 100%;
      height: 100%;
    }
  `

  @property({ attribute: false })
  tree: TextTree

  readonly #ctx: Context = {}
  #fileAndHandle: FileAndHandle | undefined
  #filename: string | undefined
  /** True if no unsaved changes. */
  #saved: boolean = false
  #timer?: number

  constructor() {
    super()
    console.log(`Linear Text v${linearTextVersion} by ──oidoid>°─`)

    const save = loadStorage()
    if (save) {
      this.#saved = save.saved
      this.tree = TextTree(save.text, 2) // to-do: pass indent
      this.#filename = save.filename
      this.#updateTitle()
    } else this.tree = TextTree('hello', 2)
  }

  protected override render(): TemplateResult {
    return html`
      <split-block
        ><group-list
          slot="lhs"
          .context=${this.#ctx}
          .tree=${this.tree}
          @blur-line=${this.#onBlurLine}
          @break-line=${this.#onBreakLine}
          @drag-line-end=${this.#onDragLineEnd}
          @edit-line=${this.#onEditLine}
          @expand-line=${this.#onExpandLine}
          @focus-line=${this.#onFocusLine}
          @remove-line=${this.#onRemoveLine}
        ></group-list
        ><text-editor
          slot="rhs"
          text="${TextTree.toString(this.tree)}"
          @edit-text=${this.#onEditText}
        ></text-editor></split-block
      ><app-menu
        @new-file=${this.#onNewFile}
        @open-file=${this.#onOpenFile}
        @save-file=${this.#onSaveFile}
        @save-file-as=${this.#onSaveFileAs}
      ></app-menu>
    `
  }

  #onBlurLine(ev: CustomEvent<BlurLine>): void {
    if (this.#ctx.focus?.line === ev.detail) delete this.#ctx.focus
  }

  #onBreakLine(ev: CustomEvent<BreakLine>): void {
    // to-do: always return the relevant node and let caller walk up tree
    const next = TextTree.breakLine(ev.detail.line, ev.detail.at, 'LF') // to-do: pass line ending
    this.#ctx.focus = { line: next.new, startOfLine: true }
    this.#updateTreeWithUnsavedChanges(next.root)
  }

  #updateTreeWithUnsavedChanges(tree: TextTree): void {
    this.tree = tree
    this.#saved = false
    this.#updateTitle()
  }
  #updateTitle(): void {
    // if (this.#saved !== saved || ) to-do: accept saved state and file handle and test for title save / diff
    setTitle(this.#filename, this.#saved)
  }

  // @add-line=${this.#onAddLine}
  //   #onAddLine(ev: CustomEvent<{ el: LitElement; group: Group }>): void {
  //   this.tree = TextTree.addLine(ev.detail.group, 'End', 'LF') // to-do: pass newline preference. Try to use first line in file but fallback to pref.
  // }

  #onEditText(ev: CustomEvent<string>): void {
    this.#updateTreeWithUnsavedChanges(TextTree(ev.detail, 2)) // to-do: pass in indent width
  }

  #onDragLineEnd(ev: CustomEvent<DragEnd>): void {
    this.#updateTreeWithUnsavedChanges(
      TextTree.moveLine(ev.detail.from, ev.detail.to, ev.detail.at),
    )
  }

  // @line-drag-over-group=${this.#onDragLineOverGroup}

  // #onDragLineOverGroup(
  //   _ev: CustomEvent<{ el: LitElement; group: Group }>,
  // ): void {
  //   // this.tree = textTreeMoveLine(this.#drag.line, ev.detail.group, 'End')
  // }

  #onEditLine(ev: CustomEvent<EditLine>): void {
    this.#updateTreeWithUnsavedChanges(
      TextTree.setLineText(ev.detail.line, ev.detail.text),
    )
  }

  #onExpandLine(ev: CustomEvent<ExpandLine>): void {
    this.tree = TextTree.setLineExpand(ev.detail.line, ev.detail.expand)
  }

  #onFocusLine(ev: CustomEvent<FocusLine>): void {
    this.#ctx.focus = {
      line: ev.detail,
      startOfLine: this.#ctx.focus?.line === ev.detail
        ? this.#ctx.focus.startOfLine
        : false,
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    addEventListener('focus', this.#onReloadFile)
    this.#timer = setInterval(
      // to-do: only save unsaved? Saving every time possibly blows away failed
      // to parse data but not saving everytime allows stale files.
      () => saveStorage(this.#filename, this.#saved, this.tree),
      30_000,
    )
  }

  override disconnectedCallback(): void {
    clearInterval(this.#timer)
    removeEventListener('focus', this.#onReloadFile)
    super.disconnectedCallback()
  }

  #onReloadFile = async (): Promise<void> => {
    if (!this.#saved || !this.#fileAndHandle) return

    // If we have a handle, we can check the timestamp of the current snapshot
    // against a new opened snapshot to determine whether to reload.
    const newFileAndHandle = await reopenFile(this.#fileAndHandle)
    if (!isFileModified(this.#fileAndHandle, newFileAndHandle)) return

    this.#fileAndHandle = newFileAndHandle
    const str = await this.#fileAndHandle.file.text()
    const textStr = TextTree.toString(this.tree)
    if (str !== textStr) this.tree = TextTree(str, 2) // this invalidates the entire board--all IDs are lost // to-do: accept indentw
  }

  #onRemoveLine(ev: CustomEvent<{ el: LitElement; line: Line }>): void {
    this.#updateTreeWithUnsavedChanges(TextTree.removeLine(ev.detail.line))
  }

  async #onSaveFile(): Promise<void> {
    const text = TextTree.toString(this.tree)
    this.#fileAndHandle = await saveFile(this.#fileAndHandle, text)
    this.#filename = this.#fileAndHandle?.file.name
    this.#saved = !!this.#fileAndHandle
    this.#updateTitle()
  }

  async #onSaveFileAs(): Promise<void> {
    const text = TextTree.toString(this.tree)
    this.#fileAndHandle = await saveFile(undefined, text)
    this.#filename = this.#fileAndHandle?.file.name
    this.#saved = !!this.#fileAndHandle
    this.#updateTitle()
  }

  #onNewFile(): void {
    this.#fileAndHandle = undefined
    this.#filename = undefined
    this.tree = TextTree('', 2) // to-do: accept indentw
    this.#saved = true
    this.#updateTitle()
  }

  async #onOpenFile(): Promise<void> {
    this.#fileAndHandle = await openFile()
    this.#filename = this.#fileAndHandle?.file.name
    if (!this.#fileAndHandle) return
    const str = await this.#fileAndHandle.file.text()
    this.tree = TextTree(str, 2) // to-do: accept indentw
    this.#saved = true
    this.#updateTitle()
  }
}

function setTitle(filename: string | undefined, saved: boolean): void {
  document.title = saved
    ? filename == null ? 'Linear Text' : `${filename} – Linear Text`
    : filename == null
    ? '• (Unsaved) – Linear Text'
    : `• ${filename} (Unsaved) – Linear Text`
  const favicon = document.querySelector<HTMLLinkElement>(
    'link[rel="icon"]',
  )
  if (favicon) favicon.href = saved ? faviconURI : faviconUnsavedURI
}
