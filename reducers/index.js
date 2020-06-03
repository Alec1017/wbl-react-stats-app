import { combineReducers } from 'redux';

import gamesReducer from './gamesReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  games: gamesReducer,
  users: usersReducer
})

export default rootReducer;