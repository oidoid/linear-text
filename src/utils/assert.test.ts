import {assert, NonNull} from './assert'

test('A false assertion throws.', () =>
  expect(() => assert(false, 'msg')).toThrow('msg'))

test('A true assertion returns.', () => expect(assert(true)).toBeUndefined())

test.each([
  ['false', false],
  ['true', true],
  ['0', 0],
  ['1', 1],
  ['{}', {}]
])('A non-nullish value %s returns.', (_, val) =>
  expect(NonNull(val)).toStrictEqual(val)
)

test('A null value throws.', () => expect(() => NonNull(null)).toThrow())

test('An undefined value throws.', () =>
  expect(() => NonNull(undefined)).toThrow())
