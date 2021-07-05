import recordsReducer, {
  RecordsState,
  increment,
  decrement,
  incrementByAmount
} from './records-slice'

const initialState: RecordsState = {
  value: 3,
  status: 'idle'
}
test('should handle initial state', () => {
  expect(recordsReducer(undefined, {type: 'unknown'})).toEqual({
    value: 0,
    status: 'idle'
  })
})

test('should handle increment', () => {
  const actual = recordsReducer(initialState, increment())
  expect(actual.value).toEqual(4)
})

test('should handle decrement', () => {
  const actual = recordsReducer(initialState, decrement())
  expect(actual.value).toEqual(2)
})

test('should handle incrementByAmount', () => {
  const actual = recordsReducer(initialState, incrementByAmount(2))
  expect(actual.value).toEqual(5)
})
