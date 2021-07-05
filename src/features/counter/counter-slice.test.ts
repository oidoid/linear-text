import counterReducer, {
  CounterState,
  increment,
  decrement,
  incrementByAmount
} from './counter-slice'

const initialState: CounterState = {
  value: 3,
  status: 'idle'
}
test('should handle initial state', () => {
  expect(counterReducer(undefined, {type: 'unknown'})).toEqual({
    value: 0,
    status: 'idle'
  })
})

test('should handle increment', () => {
  const actual = counterReducer(initialState, increment())
  expect(actual.value).toEqual(4)
})

test('should handle decrement', () => {
  const actual = counterReducer(initialState, decrement())
  expect(actual.value).toEqual(2)
})

test('should handle incrementByAmount', () => {
  const actual = counterReducer(initialState, incrementByAmount(2))
  expect(actual.value).toEqual(5)
})
