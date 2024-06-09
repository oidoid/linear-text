import {
  CSSResult,
  LitElement,
  css,
  html,
  unsafeCSS,
  type TemplateResult
} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js'
import type {TextTree} from '../tree/text-tree.js'
import {cssReset} from '../utils/css-reset.js'
import type {Context} from './context.js'
import './drag-area.js'
import gridURI from './grid.svg'
import './line-list.js'

declare global {
  interface HTMLElementTagNameMap {
    'group-list': GroupList
  }
}

@customElement('group-list')
export class GroupList extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    drag-area {
      width: 100%;
      height: 100%;
      overflow: auto;

      /* Position absolute drag elements relative this scroll container. */
      position: relative;

      display: block;
    }

    ol {
      display: inline-flex;

      /* Clear default list styling. */
      list-style: none;
      padding: 0;
      margin: 0;

      /* fill parent*/
      min-width: 100%;

      column-gap: 8px;

      min-height: 100%; /* Fill vertical space for dragging in column. */

      background-color: #f2f5f5;
      background-image: url('${unsafeCSS(gridURI)}');
      background-size: 16px;
    }

    li {
      height: 100%;
      display: block;
      padding-bottom: 54px; /* space for app menu*/
    }

    li:first-child {
      margin-left: 8px;
    }
    li:last-child {
      margin-right: 8px;
    }

    .group-header {
      cursor: grab;
      height: 12px;
      padding-top: 4px;
      padding-bottom: 1px;
      background-image: linear-gradient(
        to bottom,
        #888,
        #888 1px,
        #f2f5f5 1px,
        #f2f5f5
      );
      background-size: 100% 2px;
      background-clip: content-box;
    }

    :host(.drag) {
      cursor: grabbing; /* When dragging, set the cursor to a closed hand. */
    }
  `

  @property({attribute: false}) context: Readonly<Context> = {}
  @property({attribute: false}) tree?: Readonly<TextTree>

  protected override render(): TemplateResult {
    const groups = repeat(
      this.tree?.down ?? [],
      group => group.id,
      group => html`
        <li>
          <div class="group-header"></div>
          <line-list .context=${this.context} .list=${group}></line-list>
        </li>
      `
    )
    return html`
      <drag-area>
        <ol
          @drag-line-end=${this.#onDragLineEnd}
          @drag-line-start=${this.#onDragLineStart}
        >
          ${groups}
        </ol>
      </drag-area>
    `
  }

  #onDragLineEnd(): void {
    this.classList.remove('drag')
  }

  #onDragLineStart(): void {
    this.classList.add('drag')
  }
}
