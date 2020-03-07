import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Input, Overlay } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';

import Container from '../components/Container';
import { auth } from '../Firebase';


export default function PasswordReset(props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordReset() {
    setIsLoading(true);

    try {
      const response = await auth.sendPasswordResetEmail(email);

      setIsLoading(false);

      showMessage({
        message: "\nReset email sent!",
        description: "Check your email for a reset link",
        type: "success",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      props.navigation.navigate('Login');
    } catch (e) {
      setIsLoading(false);
      
      showMessage({
        message: "\nError",
        description: e.toString(),
        type: "danger",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Danger);
    }
  }
  
  return (
    <Container>
       <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: 10}}>
        <Button type="clear" title="Back" onPress={() => props.navigation.goBack()} />
      </View>
      
      <View style={{width: '80%'}}>
        <Text style={styles.welcome}>Forgot Password?</Text>
      </View>

      <View style={{ width: '80%', marginTop: 30}}> 
        <Input
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          leftIcon={{ type: 'font-awesome', name: 'envelope', size: 20 }}
          keyboardType='email-address'
          leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
        />
      </View>
      
      <View style={{width:'80%', marginTop: 30}}>
        <Button
          buttonStyle={{ height: 50 }}
          titleStyle={{ fontWeight: 'bold'}}
          title="Send Reset Email"
          onPress={() => handlePasswordReset()}
        />
      </View>

      <Overlay 
          isVisible={isLoading}
          width="100%"
          height="100%"
          overlayBackgroundColor="rgba(0,0,0,0.1)"
        >
          <View style={{ flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </Overlay>
    </Container>
  );
}


const styles = StyleSheet.create({
  welcome: {
    fontSize: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 10,
    fontWeight: 'bold'
  }
});