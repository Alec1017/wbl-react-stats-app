// Import all actions
import * as actions from '../actions/currentUserActions'

export const initialState = {
    currentUser: {}
}

export default function currentUserReducer(state = initialState, action) {
    switch (action.type) {
        case actions.LOGIN_USER:
            return { currentUser: action.currentUser }
        case actions.LOGOUT_USER:
            return initialState
        default:
            return state
    }
}