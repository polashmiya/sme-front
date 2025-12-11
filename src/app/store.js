import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice'
import uiReducer from '../ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
})
