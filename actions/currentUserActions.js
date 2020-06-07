
// Action Types
export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

// Action creators that return an action
export const loginCurrentUser = currentUser => ({
    type: LOGIN_USER,
    currentUser
})

// export const logoutCurrentUser = () => ({
//     type: LOGOUT_USER
// });

// function logoutCurrentUser() {
//     // We can invert control here by returning a function - the "thunk".
//     // When this function is passed to `dispatch`, the thunk middleware will intercept it,
//     // and call it with `dispatch` and `getState` as arguments.
//     // This gives the thunk function the ability to run some logic, and still interact with the store.
//     return function(dispatch) {
//         return fetchSecretSauce().then(
//         (sauce) => dispatch(makeASandwich(forPerson, sauce)),
//         (error) => dispatch(apologize('The Sandwich Shop', forPerson, error)),
//         );
//     };
// }

export const logoutCurrentUser = () => {
  return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch({ type: LOGOUT_USER })
        resolve()
      })
  }
}