import { db } from '../Firebase'

// Action types
export const GET_USERS = 'GET_USERS'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE'

// Action creators that return an action
export const getUsers = () => ({
    type: GET_USERS,
});

export const getUsersSuccess = users => ({
    type: GET_USERS_SUCCESS,
    payload: users,
});

export const getUsersFailure = () => ({
    type: GET_USERS_FAILURE,
});

// Combine them all in an asynchronous thunk
export function fetchUsers() {
    return async dispatch => {
        dispatch(getUsers())

        try {
            const users = await db.collection('users').get()
                .then(snapshot => {
                    let users = []

                    snapshot.forEach(doc => { 
                    let user = doc.data()
                    users.push(user)
                    });
                    return users
                });

            dispatch(getUsersSuccess(users))
        } catch (error) {
            dispatch(getUsersFailure())
        }
    }
}