import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';

import Container from '../components/Container';
import { auth } from '../Firebase';


export default function Settings(props) {
  const [isLoading, setIsLoading] = useState(false);

  async function updateStats() {
    //setIsLoading(true);
    console.log('test');

    try {
      let response = await fetch('http://10.0.0.54:5000/api/update_sheet');
      let data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

  
    console.log('test2');
    
    //setIsLoading(false);
  }

  function logoutConfirmation() {
    Alert.alert(
      'Are you sure you want to log out?',
      '',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => handleLogout()}
      ]
    )
  }

  function handleLogout() {
    auth.signOut();
    props.navigation.navigate('Login');

    showMessage({
      message: "\nLog out success",
      description: "You've been logged out",
      type: "info",
      style: {height: '20%', width: '70%'},
      titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
      textStyle: {textAlign: 'center'},
      duration: 2000
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <Container>
      <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: 10}}>
        <Button type="clear" title="Back" onPress={() => props.navigation.goBack()} />
      </View>

      <Text style={styles.welcome}>Settings</Text>
      
      <View style={{width:'80%', marginTop: 30}}>
        <Button
          buttonStyle={{ height: 50, backgroundColor: '#ff4444' }}
          titleStyle={{ fontWeight: 'bold'}}
          title="Log out"
          onPress={() => logoutConfirmation()}
        />
      </View>

      <View style={{width:'80%', marginTop: 30}}>
        <Button
          buttonStyle={{ height: 50, backgroundColor: '#00C851' }}
          titleStyle={{ fontWeight: 'bold'}}
          title="Update Stat Sheet"
          onPress={() => updateStats()}
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
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold'
  }
});