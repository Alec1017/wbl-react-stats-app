import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import SignUp from './pages/SignUp'
import Login from './pages/Login';
import Form from './pages/Form';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name='Form' component={Form} options={{ title: 'Add stats' }} />
      </Stack.Navigator>
      <FlashMessage position="center" />
    </NavigationContainer>
  );
}

export default App;

