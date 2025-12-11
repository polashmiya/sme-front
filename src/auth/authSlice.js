import { createSlice } from '@reduxjs/toolkit'

// Simple front-end only auth for now
const initialUser = JSON.parse(localStorage.getItem('sme_user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    status: 'idle',
    error: null,
  },
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload
      localStorage.setItem('sme_user', JSON.stringify(action.payload))
    },
    signOut: (state) => {
      state.user = null
      localStorage.removeItem('sme_user')
    },
    signUp: (state, action) => {
      state.user = action.payload
      localStorage.setItem('sme_user', JSON.stringify(action.payload))
    },
  },
})

export const { signIn, signOut, signUp } = authSlice.actions
export default authSlice.reducer
