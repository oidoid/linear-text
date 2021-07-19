import {makeID, IDFactory} from './id-factory'

test('Initial state is positive.', () => {
  const factory = IDFactory()
  expect(factory.id).toBeGreaterThan(0)
})

test('Every ID generated.', () => {
  const factory = IDFactory()
  expect(makeID(factory)).toStrictEqual(1)
  expect(makeID(factory)).toStrictEqual(2)
  expect(makeID(factory)).toStrictEqual(3)
})
