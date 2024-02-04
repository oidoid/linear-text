import {
  css,
  CSSResult,
  html,
  LitElement,
  nothing,
  type TemplateResult
} from 'lit'
import {customElement, property, state} from 'lit/decorators.js'
import {keyed} from 'lit/directives/keyed.js'
import {repeat} from 'lit/directives/repeat.js'
import type {Group, Line} from '../tree/text-tree.js'
import {cssReset} from '../utils/css-reset.js'
import type {Context} from './context.js'
import './drag-line.js'
import './note-card.js'

declare global {
  interface HTMLElementTagNameMap {
    'line-list': LineList
  }
}

@customElement('line-list')
export class LineList extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host {
      display: flex;
      align-items: flex-start; /* Default is stretch which causes dragged children to be too wide. */
      flex-direction: column;
      /* Keep area when empty. */
      min-width: var(--note-card-width);
      min-height: 100%;
    }

    drag-line {
      margin-top: 1px;
    }

    :not(:empty) {
      margin-inline-start: var(--indent);
    }
  `

  @property({attribute: false}) context: Readonly<Context> = {}
  @property({attribute: false}) list?: Readonly<Group | Line>

  @state() private _invalidate: symbol = Symbol()

  constructor() {
    super()
    this.addEventListener('drag-line-invalidate', ev => {
      this._invalidate = Symbol()
      ev.stopPropagation()
    })
  }

  protected override render(): TemplateResult {
    const lines = repeat(
      this.list?.down ?? [],
      line => line.id,
      line =>
        line.type === 'EOL'
          ? nothing
          : // to-do: shouldn't assume note-card here.
            html`<drag-line
              ><note-card .context=${this.context} .line=${line}></note-card
            ></drag-line>`
    )
    return html`${keyed(this._invalidate, lines)}`
  }
}
