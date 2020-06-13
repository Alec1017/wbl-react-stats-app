import React, { useEffect, useState } from 'react'
import { SplashScreen } from 'expo'
import * as Font from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import FlashMessage from 'react-native-flash-message'
import { Provider, connect } from 'react-redux'
import { useFonts } from '@use-expo/font'

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
  // const [fontsLoaded, setFontsLoaded] = useState(false)

  let [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    'RobotoBold': require('./assets/fonts/Roboto/Roboto-Bold.ttf')
  })

  useEffect(() => {
    SplashScreen.preventAutoHide()

    if (Object.keys(props.currentUser).length !== 0) {
      setInitialRoute('Form')
    } else {
      setInitialRoute('Login')
    }

    // (async () => {
    //   await Font.loadAsync({
    //     'Roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    //     'RobotoBold': require('./assets/fonts/Roboto/Roboto-Bold.ttf')
    //   })

    //   setFontsLoaded(true)
    // })()

    props.fetchGames()
    props.fetchUsers()
  }, [])

  if (!props.loading && fontsLoaded) {
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
