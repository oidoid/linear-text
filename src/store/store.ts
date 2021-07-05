import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import recordsReducer from './records/records-slice'

export const store = configureStore({reducer: {records: recordsReducer}})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
