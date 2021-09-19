export type ID = number & {[brand]: void}
declare const brand: unique symbol

export function ID(id: number): ID {
  return id as ID
}

export function parseID(id: string): ID {
  return ID(Number.parseInt(id))
}
