import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import Container from '../components/Container'
import { db, auth } from '../Firebase';


export default function Login(props) {

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const currentUser = await db
          .collection('users')
          .doc(user.uid)
          .get()
        
        if (currentUser != null) {
          props.navigation.navigate('Form', currentUser.data());
        } 
      } else {
        props.navigation.navigate('Login');
      }
    })
  }, []);

  return (
    <Container>
      <View style={{backgroundColor: 'black', height: '100%', width: '100%', flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Container>
  );
}