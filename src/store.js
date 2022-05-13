import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  isAuthenticated: false,
  uesr: null,
  isLoading: false,
}

const changeState = (state = initialState, { type, ...rest }) => {
  console.log(rest)
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'login':
      return { ...state, isAuthenticated: true }
    case 'logout':
      return { ...state, isAuthenticated: false }
    case 'getUser':
      return { ...state, user: { ...rest } }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
