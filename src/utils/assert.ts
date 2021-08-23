export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) throw Error(msg)
}

export function NonNull<T>(val: T | null | undefined): NonNullable<T> {
  assert(isNonNull(val), 'Value is nullish.')
  return val
}

function isNonNull<T>(val: T | null | undefined): val is NonNullable<T> {
  return val != null
}
