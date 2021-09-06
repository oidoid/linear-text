import {insertContiguous, removeContiguous} from './array-util'

test.each([
  ['Removing from a nonempty array fails.', [], 0],
  ['Removing out of array bounds fails.', ['a'], 1]
])('%s', (_, array, index) =>
  expect(() => removeContiguous(array, index)).toThrow()
)

test.each([
  ['Removing the first item rotates left.', 0, ['b', 'c']],
  ['Removing the middle item rotates left.', 1, ['a', 'c']],
  ['Removing the last item pops.', 2, ['a', 'b']]
  // eslint-disable-next-line jest/no-identical-title
])('%s', (_, index, expectedArray) => {
  const letters = ['a', 'b', 'c']
  const expectedLetter = letters[index]
  expect(removeContiguous(letters, index)).toStrictEqual(expectedLetter)
  expect(letters).toStrictEqual(expectedArray)
})

test('Inserting out of array bounds fails.', () =>
  expect(() => insertContiguous([], 0, 1)).toThrow())

test.each([
  ['Inserting into an empty array appends.', [], 0, ['a']],
  [
    'Inserting at the first position rotates right.',
    ['b', 'c'],
    0,
    ['a', 'b', 'c']
  ],
  [
    'Inserting at the middle position rotates right.',
    ['b', 'c'],
    1,
    ['b', 'a', 'c']
  ],
  ['Inserting at the last position appends.', ['b', 'c'], 2, ['b', 'c', 'a']]
  // eslint-disable-next-line jest/no-identical-title
])('%s', (_, array, index, expectedArray) => {
  insertContiguous(array, 'a', index)
  expect(array).toStrictEqual(expectedArray)
})
