import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    language: 'en',
    darkMode: false,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setLanguage: (state, action) => { state.language = action.payload },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode },
  },
})

export const { toggleSidebar, setLanguage, toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer
