import React, { createContext, useReducer } from 'react'
import { DUMMY_ACTION } from './actions'

const initialState = {}
const store = createContext(initialState)
const { Provider } = store

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case DUMMY_ACTION:
        return {
          ...state,
        }
      default:
        return state
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
