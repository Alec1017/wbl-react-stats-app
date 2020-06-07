import React, { useEffect, useState } from 'react'
import { SplashScreen } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import FlashMessage from 'react-native-flash-message'
import { Provider, connect } from 'react-redux'

import SignUp from './pages/SignUp'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import TabNavigation from './components/TabNavigation'

import { fetchGames } from './actions/gamesActions'
import { fetchUsers } from './actions/usersActions'
import { loginCurrentUser } from './actions/currentUserActions'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'


const Stack = createStackNavigator()

const App = props => {
  const [initialRoute, setInitialRoute] = useState('Login')

  useEffect(() => {
    SplashScreen.preventAutoHide()

    if (Object.keys(props.currentUser).length !== 0) {
      setInitialRoute('Form')
    } else {
      setInitialRoute('Login')
    }

    props.fetchGames()
    props.fetchUsers()
  }, [])

  if (!props.loading) {
    setTimeout(() => {
      SplashScreen.hide()
    }, 250)

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown: false, gestureEnabled: false}}>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
          <Stack.Screen name='Form' component={TabNavigation} />
        </Stack.Navigator>
        <FlashMessage position="center" />
      </NavigationContainer>
    );
  } else {
    return null
  }
};

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser,
  loading: (state.games.loading || state.users.loading),
  games: state.games.games,
  users: state.users.users,
  hasErrors: (state.games.hasErrors || state.users.hasErrors),
})

const mapDispatchToProps = dispatch => ({
  fetchGames: () => dispatch(fetchGames()),
  fetchUsers: () => dispatch(fetchUsers()),
  loginCurrentUser: userData => dispatch(loginCurrentUser(userData))
})

AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

const AppWithStore = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppConnect />
    </PersistGate>
  </Provider>
)

export default AppWithStore
