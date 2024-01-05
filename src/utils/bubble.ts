export function Bubble<T>(type: string, detail: T): CustomEvent<T> {
  // Composed bubbles through shadow DOM.
  return new CustomEvent(type, { bubbles: true, composed: true, detail })
}
