import { createSlice } from '@reduxjs/toolkit'
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    isLoading: false,
    uses: null,
    sidebarShow: true,
  },
  reducers: {
    login: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isAuthenticated = true
    },
    logout: (state) => {
      localStorage.removeItem('jwt')
      state.isAuthenticated = false
      state.uses = null
    },
    getUser: (state, action) => {
      state.uses = action.payload
      state.isAuthenticated = true
    },
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, getUser, setSidebarShow } = authSlice.actions

export default authSlice.reducer
