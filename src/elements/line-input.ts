import {
  css,
  CSSResult,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult
} from 'lit'
import {customElement, property, query, state} from 'lit/decorators.js'
import type {Line} from '../tree/text-tree.js'
import {Bubble} from '../utils/bubble.js'
import {cssReset} from '../utils/css-reset.js'
import type {Context} from './context.js'

export type BlurLine = Readonly<Line>
export type FocusLine = Readonly<Line>

declare global {
  interface HTMLElementEventMap {
    /** Hack: internal event. Defined to workaround lit-plugin lint. */
    beforeinput: InputEvent
    /** Break text requested at cursor. */
    'blur-line': CustomEvent<BlurLine>
    'break-text': CustomEvent<number>
    /** Text changed to. */
    'edit-text': CustomEvent<string>
    'focus-line': CustomEvent<FocusLine>
  }
  interface HTMLElementTagNameMap {
    'line-input': LineInput
  }
}

/** Editable single line of text that grows to fit content. */
@customElement('line-input')
export class LineInput extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    ::selection {
      background-color: var(--shade-bright-yellow);
    }

    p {
      margin-block: 0;
      /* Stagger bounding box to allow slotted button to float. */
      display: inline;
      /* break words if needed*/
      overflow-wrap: break-word;
    }
    p::before {
      /* force minimum height for empty text areas */
      float: left;
      content: '';
      display: block;
      min-height: 15.5px;
    }

    p:not(:focus) {
      /* Disable text selection which may interfere with dragging. */
      user-select: none;
    }

    p:focus {
      cursor: text;
      /* Disable Chrome and Firefox focus outline which is indicated by higher
         level elements. */
      outline-style: none;
    }
  `

  @property({attribute: false}) context: Readonly<Context> = {}
  @property({attribute: false}) line?: Readonly<Line>

  @query('p') private _p!: HTMLParagraphElement
  @state() private _spellcheck: boolean = false
  /**
   * Text render state. Undefined allows initial update since text is always a
   * string.
   */
  #text?: string | undefined

  constructor() {
    super()
    this.addEventListener('click', this.#onClick)
  }

  protected override render(): TemplateResult {
    if (this.line && this.context.focus?.line === this.line) {
      requestAnimationFrame(() => {
        this._p.focus()
        if (this.context.focus?.startOfLine) {
          this.getSelection()?.setPosition(this._p, 0)
        }
      })
    }
    return html`
      <p
        contenteditable="true"
        .innerText=${this.#text ?? ''}
        role="textbox"
        spellcheck="${this._spellcheck}"
        tabindex="0"
        @beforeinput=${this.#onBeforeInput}
        @blur=${this.#onBlur}
        @click=${this.#onClick}
        @dragstart=${this.#onDragStart}
        @focus=${this.#onFocus}
        @keyup=${this.#onKeyUp}
        @input=${this.#onInput}
      ></p>
      <slot></slot>
    `
  }

  protected override shouldUpdate(
    props: PropertyValues<this & {_spellcheck: boolean}>
  ): boolean {
    const update = super.shouldUpdate(props)
    if (this.line?.text === this.#text && !props.has('_spellcheck'))
      return false
    this.#text = this.line?.text
    return update
  }

  getSelection(): Selection | null {
    // globalThis fallback for Firefox which pierces shadow DOM.
    return (
      (<{getSelection?: () => Selection | null}>(
        this.renderRoot
      )).getSelection?.() ?? getSelection()
    )
  }

  #getCursorPosition(): number {
    return this.getSelection()?.getRangeAt(0).startOffset ?? 0
  }

  #onBeforeInput(ev: InputEvent): void {
    // https://w3c.github.io/input-events/#interface-InputEvent-Attributes

    // Removals (remove content) and un/redo (valid content) are allowed.
    if (/^(delete|history)/.test(ev.inputType)) return

    // All other edits disabled.
    ev.preventDefault()

    if (/insert(?:LineBreak|Paragraph)/.test(ev.inputType)) {
      this.dispatchEvent(
        Bubble<number>('break-text', this.#getCursorPosition())
      )
      return
    }

    // Ignore if not an insertion (add content).
    if (!/^insert/.test(ev.inputType)) return

    // to-do: map insertOrderedList and insertUnorderedList to multiple lines?

    //   const remove =
    //   (ev.key === 'Backspace' || ev.key === 'Delete') && emptyGroup
    // if (ev.key !== 'Enter' && !remove) return

    const data = ev.data ?? ev.dataTransfer?.getData('text/plain')

    const input = data?.replaceAll(/\r?\n/g, '')

    // Trigger #onInput().
    if (input) {
      this._p.focus()
      document.execCommand('insertText', false, input)
    }
  }

  #onBlur(): void {
    // to-do: should this be this.getSelection()?
    getSelection()?.empty() // Clear any selected text
    this._spellcheck = false
    if (this.line) this.dispatchEvent(Bubble<BlurLine>('blur-line', this.line))
  }

  #onClick = (): void => {
    // pointerdown default is prevented by event-translator.
    this._p.focus()
  }

  #onDragStart(ev: DragEvent): void {
    // Disable text dragging; this is confusing in a small space with line
    // dragging.
    ev.preventDefault()
  }

  #onFocus(): void {
    this._spellcheck = true
    if (this.line)
      this.dispatchEvent(Bubble<FocusLine>('focus-line', this.line))
    if (this.context.focus?.startOfLine) return

    const sel = getSelection()
    if (!sel) return

    // for tabbing and pointer down; set to eol.
    const range = document.createRange()
    range.selectNodeContents(this._p)
    range.collapse(false)

    sel.removeAllRanges()
    sel.addRange(range)
  }

  #onKeyUp(ev: KeyboardEvent): void {
    if (ev.key === 'Escape') this.blur()
  }

  #onInput(): void {
    this.#text = this._p.textContent ?? ''
    this.dispatchEvent(Bubble<string>('edit-text', this.#text))
  }
}
