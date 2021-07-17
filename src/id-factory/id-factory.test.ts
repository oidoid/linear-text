import {makeID, IDFactory} from './id-factory'

test('initial state is positive', () => {
  const factory = IDFactory()
  expect(factory.id).toBeGreaterThan(0)
})

test('increments on every ID generated', () => {
  const factory = IDFactory()
  expect(makeID(factory)).toStrictEqual(1)
  expect(makeID(factory)).toStrictEqual(2)
  expect(makeID(factory)).toStrictEqual(3)
})
