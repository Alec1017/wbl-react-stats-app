// Import all actions
import * as actions from '../actions/usersActions'

export const initialState = {
    users: [],
    loading: true,
    hasErrors: false,
}

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case actions.GET_USERS:
            return { ...state, loading: true }
        case actions.GET_USERS_SUCCESS:
            return { users: action.payload, loading: false, hasErrors: false }
        case actions.GET_USERS_FAILURE:
            return { ...state, loading: false, hasErrors: true }
        default:
            return state
    }
}