import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, Button as ButtonElement } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button } from 'react-native-paper';

import Container from '../components/Container';
import { db, auth } from '../Firebase';


export default function SignUp(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp() {
    setIsLoading(true);

    try {
      if (firstName == '') {
        throw "First name can't be empty"
      }

      if (lastName == '') {
        throw "Last name can't be emtpy"
      }

      let response = null;
      if(firstName != '' && lastName != '') {
        response = await auth.createUserWithEmailAndPassword(email, password);
      }

      if (response && response.user.uid) {
        const user = {
          uid: response.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          isAdmin: false,
          subscribed: true
        }

        setIsLoading(false);
  
        db.collection('users')
          .doc(response.user.uid)
          .set(user)
        
        props.navigation.navigate('Form', user);
      }
    } catch (e) {
      setIsLoading(false);

      let errorMessage = e.toString();
      if (errorMessage.split(" ")[0] == 'Error:') {
        errorMessage = errorMessage.split(" ");
        errorMessage.shift();
        errorMessage = errorMessage.join(' ');
      }

      showMessage({
        message: "\nError",
        description: errorMessage,
        type: "danger",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      });
    }
  }
  
  return (
    <Container>
      <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: hp('4%'), position: 'absolute', top: 0}}>
        <ButtonElement type="clear" icon={<Icon name="arrow-left" type="font-awesome" color="#007bff" />}   onPress={() => props.navigation.goBack()} />
      </View>
      
      <Text style={styles.title}>Sign Up</Text>

      <KeyboardAwareScrollView style={{ width: '80%'}}>
        <TextInput 
          label='First Name'
          placeholder='John'
          onChangeText={firstName => setFirstName(firstName)}
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          style={{ marginTop: 30 }}
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />

        <TextInput 
          label='Last Name'
          placeholder='Smith'
          onChangeText={lastName => setLastName(lastName)}
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          style={{ marginTop: 20 }}
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />

        <TextInput 
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          keyboardType='email-address'
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          style={{ marginTop: 20 }}
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />

        <TextInput 
          label='Password'
          placeholder='password'
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          style={{ marginTop: 20 }}
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />

        <Button
          loading={isLoading}
          mode='contained'
          color='#007bff'
          onPress={() => handleSignUp()}
          style={{ marginTop: 20 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          Sign up
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
    fontWeight: 'bold'
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: hp('4%'),
  },
});