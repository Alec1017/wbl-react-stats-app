import { db } from '../Firebase'

// Action Types
export const GET_GAMES = 'GET_GAMES';
export const GET_GAMES_SUCCESS = 'GET_GAMES_SUCCESS';
export const GET_GAMES_FAILURE = 'GET_GAMES_FAILURE';

// Action creators that return an action
export const getGames = () => ({
    type: GET_GAMES,
});

export const getGamesSuccess = games => ({
    type: GET_GAMES_SUCCESS,
    payload: games
});

export const getGamesFailure = () => ({
    type: GET_GAMES_FAILURE,
});

// Combine them all in an asynchronous thunk
export function fetchGames() {
    return async dispatch => {
        dispatch(getGames())

        try {
            const games = await db.collection('games').get()
                .then(snapshot => {
                    let games = []

                    snapshot.forEach(doc => { 
                    let game = doc.data()
                    games.push(game)
                    });
                    return games
                });

            dispatch(getGamesSuccess(games))
        } catch (error) {
            dispatch(getGamesFailure())
        }
    }
}