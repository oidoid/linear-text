import {css, CSSResult, html, LitElement, type TemplateResult} from 'lit'
import {customElement, property, query} from 'lit/decorators.js'
import {classMap} from 'lit/directives/class-map.js'
import {ifDefined} from 'lit/directives/if-defined.js'
import type {Line} from '../tree/text-tree.js'
import {Bubble} from '../utils/bubble.js'
import {cssReset} from '../utils/css-reset.js'
import type {Context} from './context.js'
import type {LineElement} from './line-element.js'
import './line-input.js'
import {LineInput} from './line-input.js'
import './line-list.js'

export type BreakLine = {line: Readonly<Line>; at: number}
export type EditLine = {line: Readonly<Line>; text: string}
export type ExpandLine = {line: Readonly<Line>; expand: boolean}
export type RemoveLine = {line: Readonly<Line>}

declare global {
  interface HTMLElementEventMap {
    'break-line': CustomEvent<BreakLine>
    'edit-line': CustomEvent<EditLine>
    'expand-line': CustomEvent<ExpandLine>
    'remove-line': CustomEvent<BreakLine>
  }
  interface HTMLElementTagNameMap {
    'note-card': NoteCard
  }
}

@customElement('note-card')
export class NoteCard extends LitElement implements LineElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host {
      contain: content;
      --indent: 8px;
    }

    .note {
      border-radius: 1px;
      border-width: 0.5px;
      border-color: #888;
      border-style: solid;

      padding-top: 8px;
      padding-right: 6px;
      padding-bottom: 6px;
      padding-left: 6px;

      background-color: var(--shade-yellow);
      color: var(--color, --shade-black);

      /* Show a pointing finger for the whole note except input. */
      cursor: grab;

      min-height: 24px;
      width: var(--note-card-width);
    }

    .input-wrapper {
      cursor: pointer;
    }
    .input-wrapper:focus-within {
      cursor: text;
    }
    /* display inline on p, make dogear separate inline el */

    .note:hover,
    .note:focus-within,
    :host(.ghost) > .note {
      background-color: rgb(255, 255, 215);
    }

    :host(.picked) {
      opacity: 0.3;
      --color: #0000; /* Hide text on self and child notes. */
    }

    .note:focus-within {
      border-color: black;
    }

    button {
      background-color: #0000;
      border-style: none;
      cursor: pointer;
      color: inherit;
      padding-inline: 2px;
      padding-block: 0; /* Avoid subtle layout shift for new parents. */
    }

    line-input {
      cursor: pointer;
    }

    .note::after {
      content: '';
      display: block;
      clear: both;
    }

    .hidden {
      display: none;
    }

    button:hover {
      /* to-do: vars */
      background-color: #0001;
    }

    button {
      float: right;
    }

    .input-wrapper::after {
      content: '';
      display: block;
      clear: both;
    }

    line-list:not([data-expand]) {
      /* Hide collapsed children. */
      display: none;
    }
  `

  @property({attribute: false}) context: Readonly<Context> = {}
  @property({attribute: false}) line?: Readonly<Line>
  @query('line-input') private _input!: LineInput

  protected override render(): TemplateResult {
    return html`
      <div class="note">
        <div class="input-wrapper" @click=${this.#onClickTextArea}>
          <line-input
            .context=${this.context}
            .line=${this.line}
            text=${ifDefined(this.line?.text)}
            @blur=${this.#onBlur}
            @break-text=${this.#onBreakText}
            @edit-text=${this.#onEditText}
          ></line-input
          ><button
            class=${classMap({hidden: !this.line?.down.length})}
            @click=${this.#onToggleExpand}
            title="Toggle sub-lines."
          >
            …
          </button>
        </div>
      </div>
      <line-list
        .context=${this.context}
        ?data-expand=${!this.line?.down.length || this.line?.expand}
        .list=${this.line}
      ></line-list>
    `
  }

  get rect(): DOMRect {
    return this.renderRoot.querySelector('.note')!.getBoundingClientRect()
  }

  #onClickTextArea(): void {
    this._input.click()
  }

  #onToggleExpand(ev: PointerEvent): void {
    ev.stopPropagation() // Don't leak to click on text.
    if (!this.line) return
    this.dispatchEvent(
      Bubble<ExpandLine>('expand-line', {
        line: this.line,
        expand: !this.line?.expand
      })
    )
  }

  // to-do: this should be on the line-input i think
  #onBlur(): void {
    if (!this.line || this.line.text || this.line.down.length) return
    this.dispatchEvent(Bubble<RemoveLine>('remove-line', {line: this.line}))
  }

  // to-do: pass line to lint-input and move this logic there?
  #onBreakText(ev: CustomEvent<number>): void {
    if (!this.line) return
    this.dispatchEvent(
      Bubble<BreakLine>('break-line', {line: this.line, at: ev.detail})
    )
  }

  #onEditText(ev: CustomEvent<string>): void {
    if (!this.line) return
    this.dispatchEvent(
      Bubble<EditLine>('edit-line', {line: this.line, text: ev.detail})
    )
  }
}
