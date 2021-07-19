export type ID = number & {[brand]: void}
declare const brand: unique symbol

export function ID(id: number): ID {
  return id as ID
}
