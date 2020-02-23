import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Input, Overlay } from 'react-native-elements';

import Container from '../components/Container'
import { db, auth } from '../Firebase';


export default function Login(props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const currentUser = await db
          .collection('users')
          .doc(user.uid)
          .get()

        setIsLoading(false);
        
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