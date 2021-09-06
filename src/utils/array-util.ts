import {assertDomain} from './number-util'
import {NonNull} from './assert'

/**
 * Insert val at index. If index is less than length, the items at index and
 * beyond are shifted right by one.
 */
export function insertContiguous<T>(
  array: Readonly<T>[],
  val: T,
  index: number
): void {
  assertDomain(index, 0, array.length, 'inclusive')
  array.splice(index, 0, val)
}

export function removeContiguous<T>(
  array: NonNullable<T>[],
  index: number
): NonNullable<T> {
  assertDomain(index, 0, array.length, 'inclusive-exclusive')
  return NonNull(array.splice(index, 1)[0])
}
