import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Container from '../components/Container';
import { auth, db } from '../Firebase';
import { BACKEND_API } from 'react-native-dotenv';
import { useEffect } from 'react';


export default function Settings(props) {
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(props.route.params.isAdmin);
  const [isSubscribed, setIsSubscribed] = useState(props.route.params.isSubscribed);
  const [subscribedText, setSubscribedText] = useState('Unsubscribe from emails')

  useEffect(() => {
    if (!isSubscribed) {
      setSubscribedText('Subscribe to emails');
    } else {
      setSubscribedText('Unsubscribe from emails');
    }
  })

  async function toggleEmailSubscription() {
    setIsEmailLoading(true);
    await db.collection('users').doc(props.route.params.uid).update({
      subscribed: !isSubscribed
    });
    setIsSubscribed(!isSubscribed);
    setIsEmailLoading(false);
  }

  async function updateStats() {
    setIsStatsLoading(true);

    try {
      let response = await fetch(BACKEND_API + `/${props.route.params.uid}`);
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
    
    setIsStatsLoading(false);
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
      <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: hp('4%')}}>
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
          buttonStyle={{ height: 50 }}
          titleStyle={{ fontWeight: 'bold'}}
          title={subscribedText}
          onPress={() => toggleEmailSubscription()}
          loading={isEmailLoading}
        />
      </View>

      {isAdmin &&
        <View style={{width:'80%', marginTop: 30}}>
          <Button
            loading={isStatsLoading}
            buttonStyle={{ height: 50, backgroundColor: '#00C851' }}
            titleStyle={{ fontWeight: 'bold'}}
            title="Update Stat Sheet"
            onPress={() => updateStats()}
          />
        </View>
      }
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