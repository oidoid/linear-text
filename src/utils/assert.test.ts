import {assert} from './assert'

test('A false assertion throws.', () =>
  expect(() => assert(false, 'msg')).toThrow('msg'))

test('A true assertion returns.', () => expect(assert(true)).toBeUndefined())
