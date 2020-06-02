import React, { useEffect, useState } from 'react';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import { db, auth } from './Firebase';

import SignUp from './pages/SignUp'
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import TabNavigation from './components/TabNavigation';


const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [userData, setUserData] = useState({});
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  async function getUsers() {
    const users = await db.collection('users').get()
      .then(snapshot => {
        let users = [];

        snapshot.forEach(doc => { 
          let user = doc.data();
          users.push(user);
        });
        return users;
      });

    setUsers(users);
  }

  async function getGames() {
    const games = await db.collection('games').get()
      .then(snapshot => {
        let games = [];

        snapshot.forEach(doc => { 
          let game = doc.data();
          games.push(game);
        });
        return games;
      });

    setGames(games)
  }

  useEffect(() => {
    SplashScreen.preventAutoHide();

    auth.onAuthStateChanged(async user => {
      if (user) {
        const currentUser = await db
          .collection('users')
          .doc(user.uid)
          .get()
        
        if (currentUser != null) {
          setInitialRoute('Form');
          setUserData(currentUser.data());
        } 
      } else {
        setInitialRoute('Login')
      }

      getGames();
      getUsers();

      setDataLoaded(true);
    })
  }, [])

  if (dataLoaded && games.length != 0 && users.length != 0) {
    setTimeout(() => {
      SplashScreen.hide();
    }, 250);

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown: false, gestureEnabled: false}}>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
          <Stack.Screen name='Form' component={TabNavigation} initialParams={{userData, games, users}} />
        </Stack.Navigator>
        <FlashMessage position="center" />
      </NavigationContainer>
    );
  } else {
    return null;
  }
};
