import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { TextInput, Button } from 'react-native-paper'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'

import Container from '../components/Container'
import FontText from '../utils/FontText'

import { db, auth } from '../Firebase'
import { loginCurrentUser } from '../actions/currentUserActions'
import { colors } from '../theme/colors'


const Login = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    setIsLoading(true)

    try {
      const response = await auth.signInWithEmailAndPassword(email, password)
      
      if (response.user.uid) {
        const user = await db
          .collection('users')
          .doc(response.user.uid)
          .get()

        setIsLoading(false)

        if (Object.keys(user.data()).length === 0) {
          throw "User doesn't exist"
        }

        props.loginCurrentUser(user.data())
        props.navigation.navigate('Form')
      }
      
    } catch (e) {
      setIsLoading(false)

      let errorMessage = e.toString()
      if (errorMessage.split(" ")[0] == 'Error:') {
        errorMessage = errorMessage.split(" ")
        errorMessage.shift()
        errorMessage = errorMessage.join(' ')
        errorMessage = "Username/Password is incorrect"
      }

      showMessage({
        message: "\nError",
        description: errorMessage,
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
      <FontText bold style={styles.title}>Sign In</FontText>

      <View style={{ width: '80%' }}>
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

        <TextInput 
          label='Password'
          placeholder='password'
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 20, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button 
            uppercase={false} 
            color={colors.submitButton}
            labelStyle={{ marginRight: 0}}
            onPress={() => props.navigation.navigate('PasswordReset')}
          >
              <FontText>Forgot password?</FontText>
          </Button>
        </View>

        <Button
          loading={isLoading}
          mode='contained'
          color={colors.submitButton}
          onPress={() => handleLogin()}
          style={{ marginTop: 15, borderRadius: 25 }}
          contentStyle={{ height: 50 }}
        >
          <FontText bold>{isLoading ? 'Loading' : 'Login'}</FontText>
        </Button>

        <Button 
          uppercase={false} 
          color={colors.submitButton}
          style={{ marginTop: 10 }}
          onPress={() => props.navigation.navigate('SignUp')}
        >
          <FontText>No account yet? Sign Up</FontText>
        </Button>
   
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
  }
})

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser
})

const mapDispatchToProps = dispatch => ({
  loginCurrentUser: userData => dispatch(loginCurrentUser(userData))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)