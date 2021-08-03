import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {tableSlice} from './table-slice/table-slice'
import undoable, {excludeAction, UndoableOptions} from 'redux-undo'

const undoConfig: Readonly<UndoableOptions> = Object.freeze({
  clearHistoryType: [
    tableSlice.actions.newFileAction.type,
    tableSlice.actions.saveFileAction.type
  ],
  filter: excludeAction([
    tableSlice.actions.addDividerAction.type,
    tableSlice.actions.addDraftAction.type,
    tableSlice.actions.focusLineAction.type
  ])
})

export const store = configureStore({
  reducer: {table: undoable(tableSlice.reducer, undoConfig)}
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
