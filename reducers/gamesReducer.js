// Import all actions
import * as actions from '../actions/gamesActions';

export const initialState = {
    games: [],
    loading: true,
    hasErrors: false,
}

export default function gamesReducer(state = initialState, action) {
    switch (action.type) {
        case actions.GET_GAMES:
            return { ...state, loading: true }
        case actions.GET_GAMES_SUCCESS:
            return { games: action.payload, loading: false, hasErrors: false }
        case actions.GET_GAMES_FAILURE:
            return { ...state, loading: false, hasErrors: true }
        default:
            return state
    }
}