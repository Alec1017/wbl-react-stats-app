import { combineReducers } from 'redux'

import gamesReducer from './gamesReducer'
import usersReducer from './usersReducer'
import currentUserReducer from './currentUserReducer'

const rootReducer = combineReducers({
  games: gamesReducer,
  users: usersReducer,
  currentUser: currentUserReducer
})

export default rootReducer