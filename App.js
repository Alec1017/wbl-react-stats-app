import React, { useEffect, useState } from 'react';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import { db, auth } from './Firebase';

import SignUp from './pages/SignUp'
import Login from './pages/Login';
import Form from './pages/Form';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';


const Stack = createStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [userData, setUserData] = useState({})
  const [dataLoaded, setDataLoaded] = useState(false);

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

      setDataLoaded(true);
    })
  }, [])

  if (dataLoaded) {
    setTimeout(() => {
      SplashScreen.hide();
    }, 250);

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown: false, gestureEnabled: false}}>
          <Stack.Screen name='Login' component={Login} initialParams={userData} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
          <Stack.Screen name='Form' component={Form} initialParams={userData} />
          <Stack.Screen name='Settings' component={Settings} />
        </Stack.Navigator>
        <FlashMessage position="center" />
      </NavigationContainer>
    );
  } else {
    return null;
  }
};

export default App;

