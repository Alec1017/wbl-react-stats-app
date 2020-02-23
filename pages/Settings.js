import React from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';

import Container from '../components/Container';
import { auth } from '../Firebase';


export default function Settings(props) {

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
          buttonStyle={{ height: 50 }}
          titleStyle={{ fontWeight: 'bold'}}
          title="Log out"
          onPress={() => logoutConfirmation()}
        />
      </View>
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