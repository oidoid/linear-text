/** Identity factory. */
export type IDFactory = {
  /** ID of the next. */
  id: number
}

export function IDFactory(): IDFactory {
  return {id: 1}
}

export function makeID(factory: IDFactory): number {
  const id = factory.id
  factory.id++
  return id
}
