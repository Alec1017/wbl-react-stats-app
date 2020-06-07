
// Action Types
export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

// Action creators that return an action
export const loginCurrentUser = currentUser => ({
    type: LOGIN_USER,
    currentUser
})

export const logoutCurrentUser = () => {
  return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch({ type: LOGOUT_USER })
        resolve()
      })
  }
}