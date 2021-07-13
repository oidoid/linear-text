import {TabRecord} from '../../tab/tab-record'
import recordsReducer, {
  addRecord,
  initialState,
  newFile,
  removeRecord,
  setFocus
} from './records-slice'

test('an invalid action produces the initial state', () => {
  expect(recordsReducer(undefined, {type: 'invalid'})).toStrictEqual(
    initialState
  )
})

test('addRecord() stores a record', () => {
  const record = TabRecord()
  const state = recordsReducer(initialState, addRecord(record))
  expect(state.tab.records).toStrictEqual([record])
})

test('newFile() clears tab, focus, and status', () => {
  const state = recordsReducer(initialState, newFile())
  expect(state).toStrictEqual(initialState)
})

test('setFocus() sets the focus', () => {
  let state = recordsReducer(initialState, addRecord(TabRecord()))
  state = recordsReducer(state, setFocus(0))
  expect(state.focusedRecordIndex).toStrictEqual(0)
})

test('removeRecord() deletes the record and clears focus', () => {
  let state = recordsReducer(initialState, addRecord(TabRecord()))
  state = recordsReducer(state, setFocus(0))
  state = recordsReducer(state, removeRecord(0))
  expect(state).toStrictEqual(initialState)
})
