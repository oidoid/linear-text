import {ID} from './id'

/** Identity factory. */
export type IDFactory = {
  /** ID of the next. */
  id: number
}

export function IDFactory(factory: IDFactory | undefined = {id: 1}): IDFactory {
  return {id: factory.id}
}

export function makeID(factory: IDFactory): ID {
  const id = ID(factory.id)
  factory.id++
  return id
}
