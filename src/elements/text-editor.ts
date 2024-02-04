import {
  css,
  CSSResult,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult
} from 'lit'
import {customElement, property, query} from 'lit/decorators.js'
import {Bubble} from '../utils/bubble.js'
import {cssReset} from '../utils/css-reset.js'
import {throttle} from '../utils/throttle.js'

declare global {
  interface HTMLElementTagNameMap {
    'text-editor': TextEditor
  }
  interface HTMLElementEventMap {
    'edit-text': CustomEvent<string>
  }
}

@customElement('text-editor')
export class TextEditor extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    ::selection {
      background-color: var(--shade-bright-yellow);
    }
    :host {
      min-height: 100%;
    }
    textarea {
      /* Prevent scroll. */
      display: block;

      /* Fill block. */
      min-height: 100%;
      width: 100%;

      /* Disable resizable default. */
      resize: none;

      /* Only break on newline. */
      white-space: pre;
    }
  `

  @property() text: string = ''

  #selectionStart: number = 0
  #selectionEnd: number = 0
  #scrollTopy: number = 0
  @query('textarea') private _textArea!: HTMLTextAreaElement

  protected override willUpdate(props: PropertyValues<this>): void {
    super.willUpdate(props) // super?
    if (!this._textArea) return
    // this sucks because i want xy but get in characters
    this.#selectionStart = this._textArea.selectionStart
    this.#selectionEnd = this._textArea.selectionEnd
    this.#scrollTopy = this._textArea.scrollTop
  }

  protected override updated(props: PropertyValues<this>): void {
    super.updated(props)
    this._textArea.selectionStart = this.#selectionStart
    this._textArea.selectionEnd = this.#selectionEnd
    this._textArea.scrollTop = this.#scrollTopy
  }

  protected override render(): TemplateResult {
    return html`
      <textarea
        @beforeinput=${this.#onBeforeInput}
        @input=${throttle(this.#onInput, 100)}
        spellcheck
        .value=${this.text}
      ></textarea>
    `
  }

  #onBeforeInput(ev: InputEvent): void {
    if (ev.inputType === 'insertLineBreak') {
      // Workaround unintuitive Chromium scroll behavior by manually inserting
      // a line break; https://stackoverflow.com/questions/56329625.
      ev.preventDefault()
      document.execCommand('insertText', false, '\n')
      this.#onInput()
    }
  }

  #onInput(): void {
    this.text = this._textArea?.value ?? ''
    this.dispatchEvent(Bubble<string>('edit-text', this.text))
  }
}
