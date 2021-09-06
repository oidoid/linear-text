import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {tableSlice} from './table-slice/table-slice'
import undoable, {excludeAction, UndoableOptions} from 'redux-undo'

const undoConfig: Readonly<UndoableOptions> = Object.freeze({
  clearHistoryType: [tableSlice.actions.clearHistoryAction.type],
  filter: excludeAction([
    tableSlice.actions.addDraftAction.type,
    tableSlice.actions.focusAction.type
  ])
})

export function Store() {
  return configureStore({
    reducer: {table: undoable(tableSlice.reducer, undoConfig)}
  })
}

export const store = Store()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
