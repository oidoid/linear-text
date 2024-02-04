import { css, CSSResult, html, LitElement, type TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import { cssReset } from '../utils/css-reset.js'
import { DragLine } from './drag-line.js'

declare global {
  interface HTMLElementEventMap {
    drag: DragEvent
    dragend: DragEvent
    dragstart: DragEvent
  }
  interface HTMLElementTagNameMap {
    'drag-area': DragArea
  }
}

/**
 * Translates pointer events to synthetic drag events for drag-line components.
 * The element being dragged is dispatched all events unlike native DND which
 * splits between the dragged and dragged over elements. No dragover event is
 * synthesized.
 *
 * @slot - Child to translate for.
 */
@customElement('drag-area')
export class DragArea extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host {
      /* Stretch over children. */
      display: block;
      min-height: 100%;

      /* Update for every pointermove *touch* Event like *mouse* Events. */
      touch-action: none;
    }
  `

  #gesture:
    | {
      /** Set on significant duration or movement. */
      drag?: true
      /** Most recent event intercepted. */
      ev: PointerEvent
      /** Origin of the opening pointer down event. */
      readonly start: Readonly<{ x: number; y: number }>
      /** Re-target all drag events in the gesture. */
      readonly target: HTMLElement
      /** Synthetic drag event interval timer. */
      readonly timer: ReturnType<typeof setInterval>
    }
    | undefined

  // to-do:  Disable mobile long press?
  // to-do: enable mobile scroll
  constructor() {
    super()
    this.addEventListener('contextmenu', this.#onMenu, true) // Capture.
    this.addEventListener('pointercancel', this.#onPointerUpOrCancel, true)
    this.addEventListener('pointerdown', this.#onPointerDown, true)
    this.addEventListener('pointermove', this.#onPointerMove, true)
    this.addEventListener('pointerup', this.#onPointerUpOrCancel, true)
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`
  }

  #onMenu = (ev: MouseEvent) => {
    if (this.#gesture) ev.preventDefault() // Disable right-click during drag.
  }

  #onPointerDown = (ev: PointerEvent): void => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return
    if (!ev.isPrimary || ev.buttons !== 1) return
    if (!ev.composedPath().some((target) => target instanceof DragLine)) return
    const target = ev.composedPath()[0]
    if (!(target instanceof HTMLElement)) return
    if (target.isContentEditable && target.matches(':focus')) return // Editing text.

    ev.preventDefault()
    this.#gesture = {
      ev,
      start: { x: ev.clientX, y: ev.clientY },
      target,
      timer: setInterval(() => this.#onPointerMove(this.#gesture!.ev), 10),
    }
  }

  #onPointerMove = (ev: PointerEvent): void => {
    if (!this.#gesture || !ev.isPrimary) return

    this.#gesture.ev = ev

    if (this.#gesture.drag) {
      this.#gesture.target.dispatchEvent(new DragEvent('drag', ev))
      return
    }

    const dx = ev.clientX - this.#gesture.start.x
    const dy = ev.clientY - this.#gesture.start.y
    if (
      dx * dx + dy * dy > 5 * 5 ||
      ev.timeStamp - this.#gesture.ev.timeStamp > 300
    ) {
      this.setPointerCapture(ev.pointerId)
      this.#gesture.target.dispatchEvent(new DragEvent('dragstart', ev))
      this.#gesture.drag = true
    }
  }

  #onPointerUpOrCancel = (ev: PointerEvent): void => {
    if (!this.#gesture || !ev.isPrimary) return
    if (this.#gesture.drag) {
      this.#gesture.target.dispatchEvent(new DragEvent('dragend', ev))
    }
    clearInterval(this.#gesture.timer)
    this.#gesture = undefined
  }
}
