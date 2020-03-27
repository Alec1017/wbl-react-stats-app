import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, ActionSheetIOS } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IconButton, Button } from 'react-native-paper';

import Container from '../components/Container';
import { auth, db } from '../Firebase';
import { BACKEND_API } from 'react-native-dotenv';


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
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Are you sure?',
        message: 'You will be logged out of your account. Do you want to log out?',
        options: ['Cancel', 'Log out'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleLogout();
        }
      },
    )
  }

  function handleLogout() {
    auth.signOut();
    props.navigation.reset({
      index: 0,
      routes: [
        { name: 'Login'}
      ]
    });

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
      <Text style={styles.title}>Settings</Text>

      <View style={{ width:'80%' }}>
        <Button
          mode='contained'
          color='#ff4444'
          onPress={() => logoutConfirmation()}
          style={{ marginTop: 30 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          Log Out
        </Button>

        <Button
          mode='contained'
          color='#007bff'
          loading={isEmailLoading}
          onPress={() => toggleEmailSubscription()}
          style={{ marginTop: 20 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          {isEmailLoading ? '' : subscribedText}
        </Button>

        {isAdmin &&
          <Button
            mode='contained'
            color='#00C851'
            loading={isStatsLoading}
            onPress={() => updateStats()}
            style={{ marginTop: 20 }}
            contentStyle={{ height: 50 }}
            labelStyle={{ fontWeight: 'bold'}}
          >
            {isStatsLoading ? 'Loading' : 'Update Stat Sheet'}
          </Button>
        }
      </View>
    </Container>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
    fontWeight: 'bold'
  }
});