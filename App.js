import React, { useEffect, useState } from 'react'
import { SplashScreen } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import FlashMessage from 'react-native-flash-message'
import { Provider, connect } from 'react-redux'

import { db, auth } from './Firebase'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import TabNavigation from './components/TabNavigation'
import store from './store';
import { fetchGames } from './actions/gamesActions'
import { fetchUsers } from './actions/usersActions'

const Stack = createStackNavigator()

const App = (props) => {
  const [initialRoute, setInitialRoute] = useState('Login')
  const [userData, setUserData] = useState({})

  useEffect(() => {
    SplashScreen.preventAutoHide()

    auth.onAuthStateChanged(async user => {
      if (user) {
        const currentUser = await db
          .collection('users')
          .doc(user.uid)
          .get()
        
        if (currentUser != null) {
          setInitialRoute('Form')
          setUserData(currentUser.data())
        } 
      } else {
        setInitialRoute('Login')
      }

      props.fetchGames()
      props.fetchUsers()
    })
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
          <Stack.Screen name='Form' component={TabNavigation} initialParams={{userData}} />
        </Stack.Navigator>
        <FlashMessage position="center" />
      </NavigationContainer>
    );
  } else {
    return null
  }
};

const mapStateToProps = state => ({
  loading: (state.games.loading || state.users.loading),
  games: state.games.games,
  users: state.users.users,
  hasErrors: (state.games.hasErrors || state.users.hasErrors),
})

const mapDispatchToProps = {
  fetchGames,
  fetchUsers
}

AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

const AppWithStore = () => (
  <Provider store={store}>
    <AppConnect />
  </Provider>
)

export default AppWithStore
