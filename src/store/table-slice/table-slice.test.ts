import {Table} from '../../table/table'
import {
  addLine,
  initTableState,
  newFile,
  removeLine,
  setFocus,
  tableSlice
} from './table-slice'

test('an invalid action produces the initial state', () => {
  expect(tableSlice.reducer(undefined, {type: 'invalid'})).toStrictEqual(
    initTableState
  )
})

test('addLine() stores a line', () => {
  const state = tableSlice.reducer(initTableState, addLine())
  expect(state.table.lines).toStrictEqual([
    {id: 1, text: undefined, invalidated: true, row: []}
  ])
})

test('newFile() clears tab, focus, and status', () => {
  const state = tableSlice.reducer(initTableState, newFile())
  expect(state).toStrictEqual(initTableState)
})

test('setFocus() sets the focus', () => {
  let state = tableSlice.reducer(initTableState, addLine())
  state = tableSlice.reducer(state, setFocus(0))
  expect(state.focusedLineIndex).toStrictEqual(0)
})

test('removeLine() deletes the line and clears focus', () => {
  let state = tableSlice.reducer(initTableState, addLine())
  state = tableSlice.reducer(state, setFocus(0))
  state = tableSlice.reducer(state, removeLine(0))
  expect(state).toStrictEqual({
    focusedLineIndex: undefined,
    idFactory: {id: 2},
    status: 'idle',
    table: Table()
  })
})
