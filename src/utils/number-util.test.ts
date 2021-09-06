import {inDomain} from './number-util'

test.each([
  [-2, false],
  [-1, true],
  [0, true],
  [1, true],
  [2, false]
])('%d in the domain [-1, 1]: %p.', (val, expected) =>
  expect(inDomain(val, -1, 1, 'inclusive')).toStrictEqual(expected)
)

test.each([
  [-2, false],
  [-1, false],
  [0, true],
  [1, false],
  [2, false]
])('%d in the domain (-1, 1): %p.', (val, expected) =>
  expect(inDomain(val, -1, 1, 'exclusive')).toStrictEqual(expected)
)

test.each([
  [-2, false],
  [-1, true],
  [0, true],
  [1, false],
  [2, false]
])('%d in the domain [-1, 1): %p.', (val, expected) =>
  expect(inDomain(val, -1, 1, 'inclusive-exclusive')).toStrictEqual(expected)
)

test.each([
  [-2, false],
  [-1, false],
  [0, true],
  [1, true],
  [2, false]
])('%d in the domain (-1, 1]: %p.', (val, expected) =>
  expect(inDomain(val, -1, 1, 'exclusive-inclusive')).toStrictEqual(expected)
)
