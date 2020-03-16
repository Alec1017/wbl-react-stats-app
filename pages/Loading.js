import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
      <View style={{backgroundColor: '#7CA1B4', height: '100%', width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={{ width: wp('60%') }}
          source={require('../assets/wbl-logo.png')}
          resizeMode='contain'
        />
      </View>
    </Container>
  );
}