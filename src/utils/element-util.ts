export function blurActiveElement(): void {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

/** Composed closest Element excluding el. */
export function composedAncestorElement(el: Element): Element | undefined {
  if (el.parentElement) return el.parentElement
  const root = el.getRootNode()
  if (root instanceof ShadowRoot) return root.host
}

/** Composed Element.closest(). */
export function composedClosest(
  selector: string,
  el: Element,
): Element | undefined {
  const closest = el.closest(selector)
  if (closest) return closest
  const parent = composedAncestorElement(el)
  if (parent) return composedClosest(selector, parent)
}

export function composedClosestScrollable(el: Element): Element | undefined {
  const style = getComputedStyle(el)
  if (style.overflow === 'auto' || style.overflow === 'scroll') return el
  const parent = composedAncestorElement(el)
  if (parent) return composedClosestScrollable(parent)
}

/** Composed Document.elementFromPoint(). */
export function composedElementFromPoint(x: number, y: number): Element | null {
  for (let el = document.elementFromPoint(x, y);;) {
    const next = el?.shadowRoot?.elementFromPoint(x, y)
    if (!next || el === next) return el
    el = next
  }
}

/** @arg xy Target in viewport client coordinates. */
export function scrollTowardsEdge(
  el: Element,
  xy: Readonly<{ x: number; y: number }>,
  threshold: number,
  by: number,
): void {
  const sx = xy.x < threshold ? -1 : xy.x > el.clientWidth - threshold ? 1 : 0
  const sy = xy.y < threshold ? -1 : xy.y > el.clientHeight - threshold ? 1 : 0
  el.scrollLeft = el.scrollLeft + sx * by
  el.scrollTop = el.scrollTop + sy * by
}
