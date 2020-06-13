import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInput, IconButton, Button, ToggleButton } from 'react-native-paper'
import { connect } from 'react-redux'

import Container from '../components/Container'
import FontText from '../utils/FontText'
import { db, auth } from '../Firebase'
import { loginCurrentUser } from '../actions/currentUserActions'
import { colors } from '../theme/colors'


const SignUp = props => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [division, setDivision] = useState(null)

  async function handleSignUp() {
    setIsLoading(true)

    try {
      if (firstName == '') {
        throw "First name can't be empty"
      }

      if (lastName == '') {
        throw "Last name can't be emtpy"
      }

      if (typeof division !== 'number') {
        throw "Please select a division"
      }

      let response = null;
      if(firstName != '' && lastName != '') {
        response = await auth.createUserWithEmailAndPassword(email, password)
      }

      if (response && response.user.uid) {
        const user = {
          uid: response.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          isAdmin: false,
          subscribed: true,
          division: division
        }

        setIsLoading(false)
  
        db.collection('users')
          .doc(response.user.uid)
          .set(user)
        
        props.loginCurrentUser(user)
        props.navigation.navigate('Form')
      }
    } catch (e) {
      setIsLoading(false);

      let errorMessage = e.toString()
      if (errorMessage.split(" ")[0] == 'Error:') {
        errorMessage = errorMessage.split(" ")
        errorMessage.shift()
        errorMessage = errorMessage.join(' ')
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
      <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: hp('4%'), position: 'absolute', top: 0}}>
        <IconButton icon="arrow-left" color={colors.iconButton} size={35} onPress={() => props.navigation.goBack()} />
      </View>
      
      <FontText bold style={styles.title}>Sign Up</FontText>

      <KeyboardAwareScrollView style={{ width: '80%'}}>
        <TextInput 
          label='First Name'
          placeholder='John'
          onChangeText={firstName => setFirstName(firstName)}
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 30, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <TextInput 
          label='Last Name'
          placeholder='Smith'
          onChangeText={lastName => setLastName(lastName)}
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 20, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <TextInput 
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          keyboardType='email-address'
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 20, height: hp('8%') }}
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

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
          <FontText style={styles.divisionText}>Your Division</FontText>

          <ToggleButton.Row
            onValueChange={value => setDivision(value)}
          >
            <ToggleButton
              icon="numeric-1-circle-outline"
              status={1 == division ? 'checked' : 'unchecked'}
              value={1}
            />

            <ToggleButton
              icon="numeric-2-circle-outline"
              status={2 == division ? 'checked' : 'unchecked'}
              value={2}
            />
          </ToggleButton.Row>
        </View>

        <Button
          loading={isLoading}
          mode='contained'
          color={colors.submitButton}
          onPress={() => handleSignUp()}
          style={{ marginTop: 20, borderRadius: 25 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          <FontText bold>{isLoading ? 'Loading' : 'Sign Up'}</FontText>
        </Button>
 
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
  },
  divisionText: {
    fontSize: 20,
    alignSelf: 'center',
  },
})

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser
})

const mapDispatchToProps = dispatch => ({
  loginCurrentUser: userData => dispatch(loginCurrentUser(userData))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)