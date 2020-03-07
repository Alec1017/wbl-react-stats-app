import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';

import Container from '../components/Container';
import { auth } from '../Firebase';
import { BACKEND_API } from 'react-native-dotenv';


export default function Settings(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(props.route.params.isAdmin);

  async function updateStats() {
    setIsLoading(true);

    try {
      let response = await fetch(BACKEND_API);
      let data = await response.json();
      
      let messageType = data.completed ? 'success' : 'danger';
      let messageTitle = data.completed ? 'Success!' : 'Error'
      let messageContent = data.completed ? 'Stat sheet updated' : 'Something went wrong. Try again later'
      let feedbackType = data.completed ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error;

      showMessage({
        message: `\n${messageTitle}`,
        description: messageContent,
        type: messageType,
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      });

      Haptics.notificationAsync(feedbackType);
    } catch (error) {
      showMessage({
        message: "\nError",
        description: "Something went wrong. Try again later",
        type: "danger",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      });
    }
    
    setIsLoading(false);
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

      {isAdmin &&
        <View style={{width:'80%', marginTop: 30}}>
          <Button
            buttonStyle={{ height: 50, backgroundColor: '#00C851' }}
            titleStyle={{ fontWeight: 'bold'}}
            title="Update Stat Sheet"
            onPress={() => updateStats()}
          />
        </View>
      }

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