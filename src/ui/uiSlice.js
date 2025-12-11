import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
  sidebarOpen: true,
  language: 'en',
  darkMode: false,
  sidebarWhite: true, // default: sidebar is white
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setLanguage: (state, action) => { state.language = action.payload },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode },
    toggleSidebarWhite: (state) => { state.sidebarWhite = !state.sidebarWhite },
  },
})

export const { toggleSidebar, setLanguage, toggleDarkMode, toggleSidebarWhite } = uiSlice.actions
export default uiSlice.reducer
