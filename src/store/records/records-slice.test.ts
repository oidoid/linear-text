import recordsReducer, {addRecord, RecordsState} from './records-slice'

const initialState: RecordsState = Object.freeze({records: [], status: 'idle'})

test('an invalid action produces the initial state', () => {
  expect(recordsReducer(undefined, {type: 'invalid'})).toEqual({
    records: [],
    status: 'idle'
  })
})

test('addRecord() stores a record', () => {
  const actual = recordsReducer(initialState, addRecord('record'))
  expect(actual.records).toEqual(['record'])
})
