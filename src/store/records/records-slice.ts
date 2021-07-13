import type {FileWithHandle} from 'browser-fs-access'
import type {RootState} from '../store'
import type {TabRecord} from '../../tab/tab-record'

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {parseTabFile} from '../../tab-file-parser/tab-file-parser'
import {TabFile} from '../../tab/tab-file'

export type RecordsState = Readonly<{
  tab: TabFile
  // undefined or [0, records.length)
  focusedRecordIndex: number | undefined
  status: 'idle' | 'loading' | 'failed'
}>

export const initialState: RecordsState = Object.freeze({
  tab: Object.freeze(TabFile()),
  focusedRecordIndex: undefined,
  status: 'idle'
})

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loadTabFileAsync = createAsyncThunk(
  'records/loadTabFileAsync',
  async (file: Readonly<FileWithHandle>): Promise<TabFile> => {
    // The value we return becomes the `fulfilled` action payload
    return await parseTabFile(file)
  }
)

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // Use the PayloadAction type to declare the contents of `action.payload`
    addRecord(state, action: PayloadAction<TabRecord>) {
      state.tab.records.push(action.payload)
    },
    newFile(state) {
      state.tab = TabFile()
      state.focusedRecordIndex = undefined
      state.status = 'idle'
      // [todo]: cancel loading.
    },
    removeRecord(state, {payload: index}: PayloadAction<number>) {
      const size = state.tab.records.length
      if (index < 0 || index >= size)
        throw Error(`Invalid record removal at index=${index}; size=${size}.`)
      state.tab.records.splice(index, 1)
      // Assume index is either the focused record
      state.focusedRecordIndex = undefined
    },
    setFocus(state, {payload: index}: PayloadAction<number | undefined>) {
      const size = state.tab.records.length
      if (index != null && (index < 0 || index >= size))
        throw Error(`Invalid record focus at index=${index}; size=${size}.`)
      state.focusedRecordIndex = index
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers(builder) {
    builder
      .addCase(loadTabFileAsync.pending, state => {
        state.status = 'loading'
      })
      .addCase(loadTabFileAsync.fulfilled, (state, action) => {
        state.tab = action.payload
        state.focusedRecordIndex = undefined
        state.status = 'idle'
        console.log('ok', state)
      })
      .addCase(loadTabFileAsync.rejected, state => {
        state.status = 'failed'
        // [todo]: show errors.
      })
  }
})

export const {addRecord, newFile, removeRecord, setFocus} = recordsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.records.value)`
export function selectRecords(state: RootState): RecordsState {
  return state.records
}

export default recordsSlice.reducer
