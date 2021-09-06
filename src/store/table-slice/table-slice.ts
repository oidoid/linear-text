import type {FileWithHandle} from 'browser-fs-access'
import type {GroupIndex, LineIndex} from '../../table/line-index'
import type {RootState} from '../store'

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Group} from '../../table/group'
import {IDFactory} from '../../id/id-factory'
import {Line} from '../../line/line'
import {parseTable} from '../../table-parser/table-parser'
import {Table} from '../../table/table'

export type TableState = Readonly<{
  /** The loaded / saved filename, if any. */
  filename: string | undefined
  focus: Readonly<GroupIndex> | Readonly<LineIndex> | undefined
  idFactory: Readonly<IDFactory>
  /**
   * True if unsaved changes are present. False if no changes since saved, just
   * loaded and unchanged, or new and unchanged.
   */
  invalidated: boolean
  status: 'idle' | 'loading' | 'failed'
  table: Readonly<Table>
}>

export const initTableState: TableState = Object.freeze({
  filename: undefined,
  focus: undefined,
  idFactory: Object.freeze(IDFactory()),
  invalidated: false,
  status: 'idle',
  table: Object.freeze(Table())
})

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loadTableFileAsync = createAsyncThunk<
  {filename: string; idFactory: Readonly<IDFactory>; table: Table},
  {fileWithHandle: Readonly<FileWithHandle>; idFactory: Readonly<IDFactory>},
  {state: RootState}
>('table/loadTableFileAsync', async ({fileWithHandle, idFactory}) => {
  // The value we return becomes the `fulfilled` action payload
  const factory = IDFactory(idFactory)
  const table = await parseTable(factory, fileWithHandle)
  return {filename: fileWithHandle.name, idFactory: factory, table}
})

export const tableSlice = createSlice({
  name: 'table',
  initialState: initTableState,
  // The `reducers` field lets us define reducers and generate associated
  // actions.
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // Use the PayloadAction type to declare the contents of `action.payload`
    addGroupAction(state) {
      // group or divider?an empty group is a divider
      const group = Group(state.idFactory)
      let x
      if (state.focus == null) x = Table.appendGroup(state.table, group)
      else x = Table.insertGroup(state.table, group, state.focus.x + 1)
      state.focus = {id: group.id, x}
      state.invalidated = true
    },
    addDraftAction(state) {
      const focus =
        state.focus == null || !('y' in state.focus)
          ? undefined
          : Table.getLine(state.table, state.focus)
      if (focus != null && Line.isEmpty(focus)) return // Already have a draft.
      const line = Line(state.idFactory)
      if (state.focus == null)
        state.focus = Table.appendLine(state.table, line, state.idFactory)
      else
        state.focus = Table.insertLine(
          state.table,
          line,
          {x: state.focus.x, y: 'y' in state.focus ? state.focus.y + 1 : 0},
          state.idFactory
        )
    },
    clearHistoryAction() {},
    editLineAction(
      state,
      {payload}: PayloadAction<{lineIndex: LineIndex; text: string}>
    ) {
      const line = Table.getLine(state.table, payload.lineIndex)
      Line.setText(line, payload.text)
      // The state of line is changed. It is assumed to be the focus.
      state.focus = payload.lineIndex
      state.invalidated = true
    },
    focusAction(
      state,
      {payload}: PayloadAction<LineIndex | GroupIndex | undefined>
    ) {
      state.focus = payload
    },
    newFileAction(state) {
      state.filename = undefined
      state.focus = undefined
      state.invalidated = false
      state.status = 'idle'
      state.table = Table()
      // [todo]: cancel loading.
    },
    removeGroupAction(
      state,
      {
        payload
      }: PayloadAction<{
        lineIndex: GroupIndex
        nextFocus: 'prev' | 'next' | 'retain'
      }>
    ) {
      Table.removeGroup(state.table, payload.lineIndex.x)
      state.invalidated = true
      if (payload.nextFocus === 'retain') {
        state.focus =
          state.focus?.id === payload.lineIndex.id ? undefined : state.focus
      } else {
        const x = Math.max(
          0,
          Math.min(
            payload.lineIndex.x + (payload.nextFocus === 'prev' ? -1 : 0),
            state.table.groups.length - 1
          )
        )
        const group = state.table.groups[x]
        const y = Math.max(
          0,
          Math.min(
            payload.nextFocus === 'prev' ? Number.MAX_SAFE_INTEGER : 0,
            (group?.lines.length ?? 1) - 1
          )
        )
        if (group?.lines[y]?.id == null) {
          const id = group?.id
          state.focus = id == null ? undefined : {id, x}
        } else {
          const id = group?.lines[y]?.id
          state.focus = id == null ? undefined : {id, x, y}
        }
      }
    },
    removeLineAction(
      state,
      {
        payload
      }: PayloadAction<{
        lineIndex: LineIndex
        nextFocus: 'prev' | 'next' | 'retain'
      }>
    ) {
      Table.removeLine(state.table, payload.lineIndex)
      state.invalidated = true
      if (payload.nextFocus === 'retain') {
        state.focus =
          state.focus?.id === payload.lineIndex.id ? undefined : state.focus
      } else {
        const group = Table.getGroup(state.table, payload.lineIndex)
        const oldY = payload.lineIndex.y
        const x =
          (oldY === 0 && payload.nextFocus === 'prev') ||
          (oldY === group.lines.length && payload.nextFocus === 'next')
            ? Math.max(
                0,
                Math.min(
                  payload.lineIndex.x + (payload.nextFocus === 'prev' ? -1 : 0),
                  state.table.groups.length - 1
                )
              )
            : payload.lineIndex.x
        const y = Math.max(
          0,
          Math.min(
            oldY == null ? 0 : oldY + (payload.nextFocus === 'prev' ? -1 : 0),
            (state.table.groups[x]?.lines.length ?? 1) - 1
          )
        )

        if (group?.lines[y]?.id == null) {
          const id = group?.id
          state.focus = id == null ? undefined : {id, x}
        } else {
          const id = group?.lines[y]?.id
          state.focus = id == null ? undefined : {id, x, y}
        }
      }
    },
    saveFileAction(state, {payload}: PayloadAction<string | undefined>) {
      state.filename = payload
      state.invalidated = false
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers(builder) {
    builder
      .addCase(loadTableFileAsync.pending, state => {
        state.status = 'loading'
      })
      .addCase(loadTableFileAsync.fulfilled, (state, {payload}) => {
        state.invalidated = false
        state.filename = payload.filename
        state.idFactory = payload.idFactory
        state.table = payload.table
        state.focus = undefined
        state.status = 'idle'
      })
      .addCase(loadTableFileAsync.rejected, state => {
        state.status = 'failed'
        // [todo]: show errors.
      })
  }
})

export const {
  addDraftAction,
  addGroupAction,
  clearHistoryAction,
  editLineAction,
  focusAction,
  newFileAction,
  removeGroupAction,
  removeLineAction,
  saveFileAction
} = tableSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example:
// `useSelector((state: RootState) => state.table.value)`.
export function selectTableState(state: RootState): TableState {
  return state.table.present
}
