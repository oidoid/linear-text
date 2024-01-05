import {
  css,
  CSSResult,
  html,
  LitElement,
  nothing,
  type TemplateResult,
} from 'npm:lit'
import { customElement, property } from 'npm:lit/decorators.js'
import { cssReset } from '../utils/css-reset.ts'

declare global {
  interface HTMLElementTagNameMap {
    'button-el': ButtonEl
  }
}

// to-do: rename app-button maybe
@customElement('button-el')
export class ButtonEl extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host {
      display: inline-block;
      width: fit-content;
      height: fit-content;
      margin: 2px;
    }

    /* Default button styles. Medium size. */
    button {
      /* Center the content. */
      display: flex;
      align-items: center;
      justify-content: center;

      column-gap: 4px;

      /* Clear blue wash when interacting on mobile. */
      /* -webkit-tap-highlight-color: transparent; */

      /* Buttons have rounded corners, thin grey borders, and slightly extrude. */
      border-width: 0.5px;
      border-style: outset;
      border-color: #ccc;
      border-radius: 2px;

      background-color: #efefef;

      width: 100%;
      height: 100%;
      cursor: pointer;

      /* Inherit font. */
      font-family: inherit;
      font-size: inherit;
      font-stretch: inherit;
      font-style: inherit;
      font-variant: inherit;
      font-variant-caps: small-caps;
      font-weight: inherit;
      line-height: inherit;

      /* Don't allow content highlights. */
      /* user-select: none; */

      /* Label must appear on one line. */
      white-space: nowrap;

      /* --min-press-size: 24px;
      min-width: var(--min-press-size);
      min-height: var(--min-press-size); */
      padding: 4px;
    }

    button[disabled] {
      /* Fade disabled button. */
      opacity: 0.5;
    }

    button:not([disabled]):active {
      border-style: inset;
    }

    button:not([disabled]):hover {
      background-color: #f0f2f0;
    }

    img {
      display: inline-block;
      /* Disable dragging. vs user-select in line-input*/
      -webkit-user-drag: none;
      width: 16px;
      height: 16px;
    }
  `

  @property({ type: Boolean })
  disabled: boolean = false
  @property()
  icon: string = ''

  protected override render(): TemplateResult {
    const icon = this.icon
      ? html`<img
          accesskey=${this.accessKey}
          decoding="sync"
          loading="eager"
          src=${this.icon}
        />`
      : nothing
    return html`<button ?disabled=${this.disabled}>
      ${icon}<slot></slot>
    </button>`
  }
}
