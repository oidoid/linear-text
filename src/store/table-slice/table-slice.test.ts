import {ID} from '../../id/id'
import {Table} from '../../table/table'
import {
  addLineAction,
  initTableState,
  newFileAction,
  removeLineAction,
  focusLineAction,
  tableSlice
} from './table-slice'

test('An undefined state with an invalid action produces the initial state.', () => {
  expect(tableSlice.reducer(undefined, {type: 'invalid'})).toStrictEqual(
    initTableState
  )
})

test('An invalid action produces no change.', () => {
  expect(tableSlice.reducer(initTableState, {type: 'invalid'})).toStrictEqual(
    initTableState
  )
})

test('addLineAction() stores a line and sets the focus.', () => {
  const state = tableSlice.reducer(initTableState, addLineAction())
  expect(state.table.lines).toStrictEqual([
    {id: 1, text: undefined, invalidated: true, row: []}
  ])
  expect(state.focus).toStrictEqual({
    id: 1,
    text: undefined,
    invalidated: true,
    row: []
  })
})

test('focusLineAction() with a line sets the focus.', () => {
  let state = tableSlice.reducer(initTableState, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, focusLineAction(state.table.lines[1]))
  expect(state.focus).toStrictEqual(state.table.lines[1])
})

test('focusLineAction() without a line clears the focus.', () => {
  let state = tableSlice.reducer(initTableState, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, focusLineAction(undefined))
  expect(state.focus).toStrictEqual(undefined)
})

test('newFileAction() clears tab, focus, and status.', () => {
  let state = tableSlice.reducer(initTableState, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, newFileAction())
  expect(state).toStrictEqual({
    focus: undefined,
    idFactory: {id: 4},
    invalidated: false,
    status: 'idle',
    table: Table()
  })
})

test('removeLineAction() deletes the line and sets the previous focus.', () => {
  let state = tableSlice.reducer(initTableState, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, focusLineAction(state.table.lines[1]))
  state = tableSlice.reducer(
    state,
    removeLineAction({line: state.table.lines[1]!, focus: 'prev'})
  )
  expect(state).toStrictEqual({
    focus: state.table.lines[0],
    idFactory: {id: 4},
    invalidated: true,
    status: 'idle',
    table: Table([
      {id: ID(1), text: undefined, invalidated: true, row: []},
      {id: ID(3), text: undefined, invalidated: true, row: []}
    ])
  })
})

test('removeLineAction() deletes the line and sets the next focus.', () => {
  let state = tableSlice.reducer(initTableState, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, addLineAction())
  state = tableSlice.reducer(state, focusLineAction(state.table.lines[1]))
  state = tableSlice.reducer(
    state,
    removeLineAction({line: state.table.lines[1]!, focus: 'next'})
  )
  expect(state).toStrictEqual({
    focus: state.table.lines[1],
    idFactory: {id: 4},
    invalidated: true,
    status: 'idle',
    table: Table([
      {id: ID(1), text: undefined, invalidated: true, row: []},
      {id: ID(3), text: undefined, invalidated: true, row: []}
    ])
  })
})
