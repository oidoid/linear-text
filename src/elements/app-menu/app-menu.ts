import { css, CSSResult, html, LitElement, type TemplateResult } from 'npm:lit'
import { customElement } from 'npm:lit/decorators.js'
import { Bubble } from '../../utils/bubble.ts'
import { cssReset } from '../../utils/css-reset.ts'
import '../button-el.ts'
const loadFileIconURI =
  (<{ default: string }> await import('./icons/load-file-icon.svg')).default
const newFileIconURI =
  (<{ default: string }> await import('./icons/new-file-icon.svg')).default
const saveFileAsIconURI =
  (<{ default: string }> await import('./icons/save-file-as-icon.svg')).default
const saveFileIconURI =
  (<{ default: string }> await import('./icons/save-file-icon.svg')).default

declare global {
  interface HTMLElementEventMap {
    'new-file': undefined
    'open-file': undefined
    'save-file': undefined
    'save-file-as': undefined
  }
  interface HTMLElementTagNameMap {
    'app-menu': AppMenu
  }
}

@customElement('app-menu')
export class AppMenu extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host {
      display: flex;
      padding: 4px;
      border-radius: 2px;

      padding: 2px;
      border-width: 1px;
      border-top-color: #ccc;
      border-left-color: #ccc;
      border-right-color: #ccc;
      border-bottom-color: #000;
      border-style: solid;
      border-radius: 2px;
      background-color: #f0f2f0;
    }
  `

  protected override render(): TemplateResult {
    return html`
      <button-el
        accesskey="o"
        icon=${loadFileIconURI}
        title="Load file [alt-o]."
        @click=${() =>
      this.dispatchEvent(Bubble<undefined>('open-file', undefined))}
      >
        Open…</button-el
      ><button-el
        accesskey="s"
        icon=${saveFileIconURI}
        title="Write file [alt-s]."
        @click=${() =>
      this.dispatchEvent(Bubble<undefined>('save-file', undefined))}
      >
        Save</button-el
      ><button-el
        icon=${saveFileAsIconURI}
        title="Open file save dialog."
        @click=${() =>
      this.dispatchEvent(Bubble<undefined>('save-file-as', undefined))}
      >
        Save As…</button-el
      ><button-el
        accesskey="n"
        icon=${newFileIconURI}
        title="Load empty file [alt-n]."
        @click=${() =>
      this.dispatchEvent(Bubble<undefined>('new-file', undefined))}
      >
        New
      </button-el>
    `
  }
}
