import React, { useEffect, useState } from 'react';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { db, auth } from './Firebase';

import SignUp from './pages/SignUp'
import Login from './pages/Login';
import Form from './pages/Form';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';
import Analytics from './pages/Analytics';
import Standings from './pages/Standings';


const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function TabNavigation(props) {
  return (
    <Tab.Navigator 
      initialRouteName='Form' 
      activeColor="#007bff" 
      inactiveColor="rgb(130, 130, 130)" 
      barStyle={{ backgroundColor: '#F5FCFF', borderTopWidth: 1, borderTopColor: 'rgb(212, 212, 212)', height: hp('8%') }}
    >
      <Tab.Screen 
        name='Analytics' 
        component={Analytics} 
        initialParams={props.route.params} 
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="bar-graph" size={22} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name='Form' 
        component={Form} 
        initialParams={props.route.params} 
        options={{
          tabBarLabel: 'Sheet',
          tabBarIcon: ({ color }) => (
            <AntDesign name="form" size={22} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name='Standings' 
        component={Standings} 
        initialParams={props.route.params} 
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="table" size={22} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name='Settings' 
        component={Settings} 
        initialParams={props.route.params} 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-settings" size={25} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

function App() {
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

export default App;

