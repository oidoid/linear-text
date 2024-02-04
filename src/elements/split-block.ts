import {css, CSSResult, html, LitElement, type TemplateResult} from 'lit'
import {customElement, query} from 'lit/decorators.js'
import {cssReset} from '../utils/css-reset.js'

declare global {
  interface HTMLElementTagNameMap {
    'split-block': SplitBlock
  }
}

@customElement('split-block')
export class SplitBlock extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host {
      /* Fill area. */
      display: flex;
      width: 100%;
      height: 100%;

      overflow: hidden; /* Limit width. */
    }

    .handle {
      position: relative; /* Position child relatively. */

      /* Render handle indicator; child is invisible. */
      background-color: black;
      height: 100%;
      width: 1px;
    }

    .handle:has(hr:hover) {
      background-color: red;
    }

    hr {
      opacity: 0; /* Hide. Parent is visible. */

      position: absolute; /* Remove from layout. */

      /* Make handle wide and fit the parent. If it's too wide, it blocks drag
         scrolling. */
      width: 9px;
      height: 100%;
      margin: 0;

      /* Center relative parent. */
      left: -4px;

      flex-grow: 0;

      cursor: ew-resize;
    }

    [name='lhs'] {
      display: block;
      flex-shrink: 1;
      width: 100%;
      height: 100%;
      overflow: auto;
      resize: horizontal;
    }

    [name='rhs'] {
      display: block;
      height: 100%;
      flex-basis: 0;
      flex-shrink: 1;
      flex-grow: 9999;
      overflow: auto;
    }
  `

  @query('slot[name="lhs"]') private _lhs!: HTMLSlotElement

  // to-do: make handle friendly
  protected override render(): TemplateResult {
    return html`
      <slot name="lhs"></slot>
      <div class="handle"><hr @pointerdown=${this.#onStartResize} /></div>
      <slot name="rhs"></slot>
    `
  }

  #onEndResize(ev: PointerEvent & {currentTarget: HTMLElement}): void {
    ev.currentTarget.onpointercancel = null
    ev.currentTarget.onpointerup = null
    ev.currentTarget.onpointermove = null
    ev.currentTarget.releasePointerCapture(ev.pointerId)
  }
  #onResize(ev: PointerEvent): void {
    // to-do: fix resize on corner drag too.
    if (ev.clientX + 16 > this.clientWidth) this._lhs.style.width = ''
    // zap away so that window resize doesn't cause the split to reappear
    else this._lhs.style.width = `${ev.clientX}px`
  }

  #onStartResize(ev: PointerEvent & {currentTarget: HTMLElement}): void {
    // to-do: what am I doing here? why do i think it's ok to change on* props?
    ev.currentTarget.setPointerCapture(ev.pointerId)
    ev.currentTarget.onpointermove = ev => this.#onResize(ev)
    ev.currentTarget.onpointercancel = ev.currentTarget.onpointerup = ev =>
      this.#onEndResize(<PointerEvent & {currentTarget: HTMLElement}>ev)
  }
}
