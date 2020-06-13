import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { Ionicons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import Form from '../pages/Form'
import Settings from '../pages/Settings'
import Analytics from '../pages/Analytics'
import Standings from '../pages/Standings'

import { colors } from '../theme/colors'


const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation() {
    return (
      <Tab.Navigator 
        initialRouteName='Form' 
        activeColor={colors.tabActive}
        inactiveColor={colors.tabInactive} 
        barStyle={{ backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: 'rgb(212, 212, 212)', height: hp('8%') }}
      >
        <Tab.Screen 
          name='Analytics' 
          component={Analytics} 
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo name="bar-graph" size={22} color={color} />
            ),
          }} 
        />
        <Tab.Screen 
          name='Form' 
          component={Form} 
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
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name="table" size={22} color={color} />
            ),
          }} 
        />
        <Tab.Screen 
          name='Settings' 
          component={Settings} 
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="md-settings" size={25} color={color} />
            ),
          }} 
        />
      </Tab.Navigator>
    )
  }