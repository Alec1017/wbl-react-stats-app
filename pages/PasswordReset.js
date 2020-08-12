import React, { useState } from 'react'
import * as Haptics from 'expo-haptics'
import { StyleSheet, Text, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { TextInput, IconButton, Button } from 'react-native-paper'

import Container from '../components/Container'
import FontText from '../utils/FontText'
import { colors } from '../theme/colors'
import { BACKEND_API } from 'react-native-dotenv'


export default function PasswordReset(props) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handlePasswordReset() {
    setIsLoading(true)

    try {
      const resetResponse = await fetch(BACKEND_API + '/auth/password_reset_request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
      });
      const resetData = await resetResponse.json();

      if (!resetData.success) {
        throw 'Something went wrong. please try again.'
      }

      setIsLoading(false)

      showMessage({
        message: "\nReset email sent!",
        description: "Check your email for a reset link",
        type: "success",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      })

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      props.navigation.navigate('Login')
    } catch (e) {
      setIsLoading(false)
      
      showMessage({
        message: "\nError",
        description: e.toString(),
        type: "danger",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      })
    }
  }
  
  return (
    <Container>
      <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: hp('4%'), position: 'absolute', top: 0}}>
        <IconButton icon="arrow-left" color={colors.iconButton} size={35} onPress={() => props.navigation.goBack()} />
      </View>

      <FontText bold style={styles.title}>Password Reset</FontText>
      
      <View style={{width: '80%'}}>
        <TextInput 
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          keyboardType='email-address'
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 30, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <Button
          loading={isLoading}
          mode='contained'
          color={colors.submitButton}
          onPress={() => handlePasswordReset()}
          style={{ marginTop: 20, borderRadius: 25 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          <FontText bold>{isLoading ? 'Loading' : 'Send Reset Email'}</FontText>
        </Button>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
  }
})