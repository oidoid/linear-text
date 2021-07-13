/**
 * Evaluate whether val is a string-encoded finite number.
 *
 * Tested indirectly via cell-type.
 *
 * @see https://stackoverflow.com/a/1830844/970346
 */
export function isNumeric(val: string): boolean {
  return !isNaN(global.parseFloat(val)) && isFinite(val as any)
}
