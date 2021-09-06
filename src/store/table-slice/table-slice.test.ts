import {ActionCreators} from 'redux-undo'
import {
  addDraftAction,
  addGroupAction,
  editLineAction,
  initTableState,
  newFileAction,
  removeLineAction,
  focusAction,
  tableSlice,
  TableState,
  clearHistoryAction,
  removeGroupAction,
  saveFileAction
} from './table-slice'
import {ID} from '../../id/id'
import type {Line} from '../../line/line'
import type {Group} from '../../table/group'
import {Table} from '../../table/table'
import {Store} from '../store'

test('An undefined state with an invalid action produces the initial state.', () =>
  expect(tableSlice.reducer(undefined, {type: 'invalid'})).toStrictEqual(
    initTableState
  ))

test('An invalid action produces no change.', () =>
  expect(tableSlice.reducer(initTableState, {type: 'invalid'})).toStrictEqual(
    initTableState
  ))

test('Adding a draft stores a line and sets the focus.', () => {
  const state = tableSlice.reducer(initTableState, addDraftAction())
  const line: Line = {id: ID(1), text: ''}
  expect(state.table.groups).toStrictEqual([{id: ID(2), lines: [line]}])
  expect(state.focus).toStrictEqual({id: ID(1), x: 0, y: 0})
  expect(state.invalidated).toStrictEqual(false)
})

test('Adding a draft with focus inserts.', () => {
  let state = tableSlice.reducer(initTableState, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'abc'})
  )
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(3), x: 0, y: 1}, text: 'def'})
  )
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(4), x: 0, y: 2}, text: 'ghi'})
  )
  state = tableSlice.reducer(state, focusAction({id: ID(3), x: 0, y: 1}))
  state = tableSlice.reducer(state, addDraftAction())

  const lines: Line[] = [
    {id: ID(1), text: 'abc'},
    {id: ID(3), text: 'def'},
    {id: ID(5), text: ''},
    {id: ID(4), text: 'ghi'}
  ]
  expect(state.table.groups).toStrictEqual([{id: ID(2), lines}])
  expect(state.focus).toStrictEqual({id: ID(5), x: 0, y: 2})
})

test('Adding a draft without focus appends.', () => {
  let state = tableSlice.reducer(initTableState, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'abc'})
  )
  state = tableSlice.reducer(state, focusAction())
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(3), x: 0, y: 1}, text: 'def'})
  )

  const lines: Line[] = [
    {id: ID(1), text: 'abc'},
    {id: ID(3), text: 'def'}
  ]
  expect(state.table.groups).toStrictEqual([{id: ID(2), lines}])
  expect(state.focus).toStrictEqual({id: ID(3), x: 0, y: 1})
})

test('Adding a group stores a group and sets the focus.', () => {
  const state = tableSlice.reducer(initTableState, addGroupAction())
  const group: Group = {id: ID(1), lines: []}
  expect(state.table.groups).toStrictEqual([group])
  expect(state.focus).toStrictEqual({id: ID(1), x: 0})
})

test('Adding a group with focus inserts.', () => {
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, focusAction({id: ID(2), x: 1}))
  state = tableSlice.reducer(state, addGroupAction())

  const groups: Group[] = [
    {id: ID(1), lines: []},
    {id: ID(2), lines: []},
    {id: ID(4), lines: []},
    {id: ID(3), lines: []}
  ]
  expect(state.table.groups).toStrictEqual(groups)
  expect(state.focus).toStrictEqual({id: ID(4), x: 2})
})

test('Adding a group without focus appends.', () => {
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())

  const groups: Group[] = [
    {id: ID(1), lines: []},
    {id: ID(2), lines: []},
    {id: ID(3), lines: []}
  ]
  expect(state.table.groups).toStrictEqual(groups)
  expect(state.focus).toStrictEqual({id: ID(3), x: 2})
})

test('Saving clears invalidation and sets filename.', () => {
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, saveFileAction('filename'))
  expect(state.filename).toStrictEqual('filename')
  expect(state.invalidated).toStrictEqual(false)
})

test('focusLineAction() sets the focus.', () => {
  let state = tableSlice.reducer(initTableState, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'abc'})
  )
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(3), x: 0, y: 1}, text: 'def'})
  )
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(5), x: 1, y: 0}, text: 'ghi'})
  )
  state = tableSlice.reducer(state, focusAction({id: ID(3), x: 0, y: 1}))
  expect(state.focus).toStrictEqual({id: ID(3), x: 0, y: 1})
})

test('focusLineAction() without a line clears the focus.', () => {
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, focusAction(undefined))
  expect(state.focus).toStrictEqual(undefined)
})

test('newFileAction() clears tab, focus, and status.', () => {
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addGroupAction())
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
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(2), x: 0, y: 0}, text: 'abc'})
  )
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(4), x: 1, y: 0}, text: 'def'})
  )
  state = tableSlice.reducer(
    state,
    removeLineAction({lineIndex: {id: ID(4), x: 1, y: 0}, nextFocus: 'prev'})
  )
  const expectedState: TableState = {
    filename: undefined,
    focus: {id: ID(3), x: 0},
    idFactory: {id: 5},
    invalidated: true,
    status: 'idle',
    table: Table([
      {id: ID(1), lines: [{id: ID(2), text: 'abc'}]},
      {id: ID(3), lines: []}
    ])
  }
  expect(state).toStrictEqual(expectedState)
})

test('removeLineAction() deletes the line and sets the next focus.', () => {
  let state = tableSlice.reducer(initTableState, addGroupAction())
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(2), x: 0, y: 0}, text: 'abc'})
  )
  state = tableSlice.reducer(state, addGroupAction())
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(4), x: 1, y: 0}, text: 'def'})
  )
  state = tableSlice.reducer(state, addDraftAction())
  state = tableSlice.reducer(
    state,
    editLineAction({lineIndex: {id: ID(5), x: 1, y: 1}, text: 'ghi'})
  )
  state = tableSlice.reducer(state, focusAction({id: ID(4), x: 1, y: 0}))
  state = tableSlice.reducer(
    state,
    removeLineAction({lineIndex: {id: ID(4), x: 1, y: 0}, nextFocus: 'next'})
  )
  const expectedState: TableState = {
    filename: undefined,
    focus: {id: ID(5), x: 1, y: 0},
    idFactory: {id: 6},
    invalidated: true,
    status: 'idle',
    table: Table([
      {id: ID(1), lines: [{id: ID(2), text: 'abc'}]},
      {id: ID(3), lines: [{id: ID(5), text: 'ghi'}]}
    ])
  }
  expect(state).toStrictEqual(expectedState)
})

test('Undo / redo has no effect when no changes have been made.', () => {
  const store = Store()

  const expected: TableState = {
    filename: undefined,
    focus: undefined,
    idFactory: {id: ID(1)},
    invalidated: false,
    status: 'idle',
    table: {groups: [], lineBreak: '\n'}
  }

  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(expected)

  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Undo / redo ignores a draft.', () => {
  const store = Store()
  store.dispatch(addDraftAction())
  const expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: false,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: ''}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(expected)
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Undo / redo a draft and edit.', () => {
  const store = Store()
  store.dispatch(addDraftAction())
  store.dispatch(
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'abc'})
  )
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(initTableState)

  const expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: 'abc'}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Undo / redo a line removal.', () => {
  const store = Store()
  store.dispatch(addDraftAction())
  store.dispatch(
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'abc'})
  )
  store.dispatch(
    removeLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, nextFocus: 'retain'})
  )
  let expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: 'abc'}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(expected)

  expected = {
    filename: undefined,
    focus: undefined,
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {groups: [{id: ID(2), lines: []}], lineBreak: '\n'}
  }
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Undo / redo a group removal.', () => {
  const store = Store()
  store.dispatch(addGroupAction())
  store.dispatch(
    removeGroupAction({lineIndex: {id: ID(1), x: 0}, nextFocus: 'retain'})
  )
  let expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0},
    idFactory: {id: ID(2)},
    invalidated: true,
    status: 'idle',
    table: {groups: [{id: ID(1), lines: []}], lineBreak: '\n'}
  }
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(expected)

  expected = {
    filename: undefined,
    focus: undefined,
    idFactory: {id: ID(2)},
    invalidated: true,
    status: 'idle',
    table: {groups: [], lineBreak: '\n'}
  }
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Undo / redo a group addition.', () => {
  const store = Store()
  store.dispatch(addGroupAction())
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(initTableState)

  const expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0},
    idFactory: {id: ID(2)},
    invalidated: true,
    status: 'idle',
    table: {groups: [{id: ID(1), lines: []}], lineBreak: '\n'}
  }
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Clearing history empties the undo / redo buffer.', () => {
  const store = Store()
  store.dispatch(addGroupAction())
  store.dispatch(clearHistoryAction())
  store.dispatch(ActionCreators.undo())

  const expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0},
    idFactory: {id: ID(2)},
    invalidated: true,
    status: 'idle',
    table: {groups: [{id: ID(1), lines: []}], lineBreak: '\n'}
  }
  expect(store.getState().table.present).toStrictEqual(expected)

  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})

test('Undoing / redo one edit at a time.', () => {
  const store = Store()
  store.dispatch(addDraftAction())
  store.dispatch(
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'a'})
  )
  store.dispatch(
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'ab'})
  )
  store.dispatch(
    editLineAction({lineIndex: {id: ID(1), x: 0, y: 0}, text: 'abc'})
  )
  let expected: TableState = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: 'ab'}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(expected)
  expected = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: 'a'}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(expected)
  store.dispatch(ActionCreators.undo())
  expect(store.getState().table.present).toStrictEqual(initTableState)

  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)

  expected = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: 'ab'}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)

  expected = {
    filename: undefined,
    focus: {id: ID(1), x: 0, y: 0},
    idFactory: {id: ID(3)},
    invalidated: true,
    status: 'idle',
    table: {
      groups: [{id: ID(2), lines: [{id: ID(1), text: 'abc'}]}],
      lineBreak: '\n'
    }
  }
  store.dispatch(ActionCreators.redo())
  expect(store.getState().table.present).toStrictEqual(expected)
})
