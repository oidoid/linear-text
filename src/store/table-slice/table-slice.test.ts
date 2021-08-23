import {ID} from '../../id/id'
import type {Line} from '../../line/line'
import {Table} from '../../table/table'
import {
  addDraftAction,
  addDividerAction,
  initTableState,
  newFileAction,
  removeLineAction,
  focusLineAction,
  tableSlice
} from './table-slice'

// [to-do]: add tests most especially around un/redo. See undo branch.
// - loadTableFileAsync
// - editLineTextAction
// - saveFileAction
// - undoAction
// - redoAction

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
  const state = tableSlice.reducer(initTableState, addDraftAction())
  const line: Line = {id: ID(1), state: 'draft', text: ''}
  expect(state.table.lines).toStrictEqual([line])
  expect(state.focus).toStrictEqual({id: line.id, x: 0})
})

test('focusLineAction() with a line sets the focus.', () => {
  let state = tableSlice.reducer(initTableState, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(
    state,
    focusLineAction({id: state.table.lines[1]!.id, x: 1})
  )
  expect(state.focus).toStrictEqual({id: state.table.lines[1]!.id, x: 1})
})

test('focusLineAction() without a line clears the focus.', () => {
  let state = tableSlice.reducer(initTableState, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, focusLineAction(undefined))
  expect(state.focus).toStrictEqual(undefined)
})

test('newFileAction() clears tab, focus, and status.', () => {
  let state = tableSlice.reducer(initTableState, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, newFileAction())
  expect(state).toStrictEqual({
    filename: undefined,
    focus: undefined,
    idFactory: {id: 4},
    invalidated: false,
    status: 'idle',
    table: Table()
  })
})

test('removeLineAction() deletes the line and sets the previous focus.', () => {
  let state = tableSlice.reducer(initTableState, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(
    state,
    focusLineAction({id: state.table.lines[1]!.id, x: 1})
  )
  state = tableSlice.reducer(
    state,
    removeLineAction({
      index: {id: state.table.lines[1]!.id, x: 1},
      nextFocus: 'prev'
    })
  )
  expect(state).toStrictEqual({
    filename: undefined,
    focus: {id: state.table.lines[0]!.id, x: 0},
    idFactory: {id: 4},
    invalidated: true,
    status: 'idle',
    table: Table('\n', [
      {id: ID(1), state: 'divider', text: ''},
      {id: ID(3), state: 'divider', text: ''}
    ])
  })
})

test('removeLineAction() deletes the line and sets the next focus.', () => {
  let state = tableSlice.reducer(initTableState, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(state, addDividerAction())
  state = tableSlice.reducer(
    state,
    focusLineAction({id: state.table.lines[1]!.id, x: 1})
  )
  state = tableSlice.reducer(
    state,
    removeLineAction({
      index: {id: state.table.lines[1]!.id, x: 1},
      nextFocus: 'next'
    })
  )
  expect(state).toStrictEqual({
    filename: undefined,
    focus: {id: state.table.lines[1]!.id, x: 1},
    idFactory: {id: 4},
    invalidated: true,
    status: 'idle',
    table: Table('\n', [
      {id: ID(1), state: 'divider', text: ''},
      {id: ID(3), state: 'divider', text: ''}
    ])
  })
})
