import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import Home from './pages/Home';
import Form from './pages/Form';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Form' component={Form} options={{ title: 'Add stats' }} />
      </Stack.Navigator>
      <FlashMessage position="center" />
    </NavigationContainer>
  );
}

export default App;

