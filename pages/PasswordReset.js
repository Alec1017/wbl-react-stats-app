import React, { useState } from 'react'
import * as Haptics from 'expo-haptics'
import { StyleSheet, Text, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { TextInput, IconButton, Button } from 'react-native-paper'

import Container from '../components/Container'
import { auth } from '../Firebase'


export default function PasswordReset(props) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handlePasswordReset() {
    setIsLoading(true)

    try {
      const response = await auth.sendPasswordResetEmail(email)

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
        <IconButton icon="arrow-left" color="#007bff" size={35} onPress={() => props.navigation.goBack()} />
      </View>

      <Text style={styles.title}>Password</Text>
      
      <View style={{width: '80%'}}>
        <TextInput 
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          keyboardType='email-address'
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          style={{ marginTop: 30 }}
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />

        <Button
          loading={isLoading}
          mode='contained'
          color='#007bff'
          onPress={() => handlePasswordReset()}
          style={{ marginTop: 20 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          {isLoading ? 'Loading' : 'Send Reset Email'}
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
    fontWeight: 'bold'
  }
})