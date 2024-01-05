/** Evaluate whether str is a finite number. */
export function isNumeric(str: string): boolean {
  // https://stackoverflow.com/a/1830844/970346
  return !isNaN(parseFloat(str)) && isFinite(<number> (<unknown> str))
}
