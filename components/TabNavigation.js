import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Form from '../pages/Form';
import Settings from '../pages/Settings';
import Analytics from '../pages/Analytics';
import Standings from '../pages/Standings';


const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation(props) {
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