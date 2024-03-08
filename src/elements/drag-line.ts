import {css, CSSResult, html, LitElement, type TemplateResult} from 'lit'
import {customElement} from 'lit/decorators.js'
import type {Group, Line, PositionLine} from '../tree/text-tree.js'
import {Bubble} from '../utils/bubble.js'
import {cssReset} from '../utils/css-reset.js'
import {
  blurActiveElement,
  composedAncestorElement,
  composedClosest,
  composedClosestScrollable,
  composedElementFromPoint,
  scrollTowardsEdge
} from '../utils/element-util.js'
import type {LineEl} from './line-el.js'
import {LineList} from './line-list.js'

export type DragEnd = {
  readonly from: Readonly<Line>
  readonly to: Readonly<Line | Group>
  readonly at: PositionLine
}

declare global {
  interface HTMLElementEventMap {
    'drag-line-end': CustomEvent<DragEnd>
    'drag-line-invalidate': CustomEvent<undefined>
    'drag-line-start': CustomEvent<undefined>
  }
  interface HTMLElementTagNameMap {
    'drag-line': DragLine
  }
}

/** @slot - LineElement. */
@customElement('drag-line')
export class DragLine extends LitElement {
  static override styles: CSSResult = css`
    ${cssReset}

    :host(.picked) {
      pointer-events: none; /* Ignore elementFromPoint(). */
    }

    :host(.ghost) {
      /* Position relative scrollable top-left. */
      position: absolute;
      top: 0;
      left: 0;

      pointer-events: none; /* Ignore elementFromPoint(). */
    }
  `

  #drag:
    | {
        /** Cursor position relative this. */
        readonly cursor: Readonly<{x: number; y: number}>
        /** A clone of this modified to follow the cursor. */
        readonly ghost: DragLine
        readonly line: Readonly<Line>
        over?: {at: PositionLine; line: Readonly<Line>}
        parent: Element
      }
    | undefined

  constructor() {
    super()
    this.addEventListener('drag', this.#onDragMove)
    this.addEventListener('dragend', this.#onDragEnd)
    this.addEventListener('dragstart', this.#onDragStart)
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`
  }

  #onDragEnd = (ev: DragEvent): void => {
    ev.stopPropagation() // Don't pass to parent drag-lines.
    if (ev.isTrusted) return // Only synthetic drags expected.
    if (!this.#drag) return

    this.#drag.ghost.remove()
    this.classList.remove('picked')
    queryLineElement(this)?.classList.remove('picked')
    if (this.#drag.over) {
      this.dispatchEvent(
        Bubble<DragEnd>('drag-line-end', {
          from: this.#drag.line,
          to: this.#drag.over.line,
          at: this.#drag.over.at
        })
      )
      // Lit components track children rendered from the model. Manually adding
      // or removing a child may cause a duplicate or missing child on model
      // update. Unconditionally remove the drag element and invalidate both
      // parent lists it was associated with.

      this.#drag.parent.dispatchEvent(
        Bubble<undefined>('drag-line-invalidate', undefined)
      )
      this.dispatchEvent(Bubble<undefined>('drag-line-invalidate', undefined))
      this.remove()
      this.#drag = undefined
    }
  }

  #onDragMove = (ev: DragEvent): void => {
    ev.stopPropagation() // Don't pass to parent drag-lines.
    if (ev.isTrusted) return // Only synthetic drags expected.
    if (!this.#drag) return

    const scrollable = composedClosestScrollable(this)
    if (!scrollable) throw Error('missing scrollable ancestor')
    this.#moveGhostToCursor(scrollable, ev)

    if (scrollable) {
      scrollTowardsEdge(scrollable, {x: ev.clientX, y: ev.clientY}, 32, 4)
    }

    const el = composedElementFromPoint(ev.pageX, ev.pageY)
    if (!el) return

    const over = <DragLine | LineList | undefined>(
      composedClosest('drag-line, line-list', el)
    )
    if (!over) return
    const overLine =
      over instanceof DragLine ? queryLineElement(over)?.line : undefined // to-do: fix for list
    if (!overLine) return

    let op = computeDragOp(ev, this, over)
    let at: PositionLine
    switch (op) {
      case 'append':
      case 'prepend': {
        op = 'prepend' // to-do: support append
        at = 'In'
        let list
        if (over instanceof DragLine) {
          list = queryLineElement(over)!.renderRoot.querySelector('line-list')!
        } else list = over
        list.renderRoot[op](this) // to-do: make interface for injecting
        break
      }
      case 'after':
        at = 'End'
        over[op](this)
        break
      case 'before':
        at = 'Start'
        over[op](this)
        break
      default:
        op satisfies 'none'
        return
    }
    this.#drag.over = {at, line: overLine}
  }

  #onDragStart = (ev: DragEvent): void => {
    ev.stopPropagation() // Don't pass to parent drag-lines.
    if (ev.isTrusted) return // Only synthetic drags expected.
    const lineEl = queryLineElement(this)
    if (lineEl?.line == null) return // to-do: !lineEl?.line

    const scrollable = composedClosestScrollable(this)
    if (!scrollable) throw Error('missing scrollable ancestor')
    const parent = composedAncestorElement(this)
    if (!parent) throw Error('missing parent')

    this.#drag = {
      cursor: {x: ev.offsetX, y: ev.offsetY},
      ghost: <DragLine>this.cloneNode(true), // Before add('picked') and follow.
      line: lineEl.line,
      parent: parent
    }

    this.classList.add('picked')
    lineEl.classList.add('picked')

    if (this.#drag.ghost.children[0]) {
      ;(<Element & {line: Line}>this.#drag.ghost.children[0]).line = lineEl.line
      this.#drag.ghost.children[0].classList.add('ghost')
      // setTimeout(() => this.#drag.ghost.children[0].classList.add('ghost'), 10)
    }
    this.#drag.ghost.classList.add('ghost')
    this.#moveGhostToCursor(scrollable, ev)
    scrollable.appendChild(this.#drag.ghost) // Allow drag scrolling.

    blurActiveElement() // Deselect any text.
    this.dispatchEvent(Bubble<undefined>('drag-line-start', undefined))
  }

  #moveGhostToCursor(scrollable: Element, ev: DragEvent): void {
    if (!this.#drag) return
    const rect = this.getBoundingClientRect()
    const x = Math.max(
      0,
      Math.min(
        scrollable.scrollLeft + ev.pageX - this.#drag.cursor.x,
        scrollable.scrollWidth - rect.width - 1
      )
    )
    const y = Math.max(
      0,
      Math.min(
        scrollable.scrollTop + ev.pageY - this.#drag.cursor.y,
        scrollable.scrollHeight - rect.height - 1
      )
    )
    this.#drag.ghost.style.translate = `${x}px ${y}px`
  }
}

/**
 * @arg ev Event for dragged element.
 * @arg over Element dragged over.
 */
function computeDragOp(
  ev: DragEvent,
  picked: DragLine,
  over: DragLine | LineList
): 'none' | 'after' | 'append' | 'before' | 'prepend' {
  if (over.contains(picked)) return 'none' // Pivoting over picked may oscillate.
  if (over instanceof LineList) return 'append'

  const lineEl = queryLineElement(over)
  if (!lineEl) return 'none'

  const rect = lineEl.rect
  const offset = {x: ev.pageX - rect.x, y: ev.pageY - rect.y}

  const above = offset.y / rect.height < 0.5
  const inside = offset.x / rect.width >= 0.5
  const expanded = lineEl.line?.expand

  if (above) return over.previousElementSibling === picked ? 'none' : 'before'
  if (expanded) return 'prepend' // Intent is to reparent regardless of inside.
  // Only new subordinated lists can be started.
  if (inside && !lineEl.line?.down.length) return 'append'
  return over.nextElementSibling === picked ? 'none' : 'after'
}

function queryLineElement(el: LitElement): LineEl | undefined {
  return <LineEl>el.renderRoot.querySelector('slot')!.assignedElements()[0]
}
