import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
       <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: hp('4%')}}>
        <Button type="clear" title="Back" onPress={() => props.navigation.goBack()} />
      </View>
      
      <Text style={styles.welcome}>Sign Up</Text>

      <KeyboardAwareScrollView style={{ width: '80%'}}>
        <View style={{marginTop: 30}}> 
          <Input
            label='First Name'
            placeholder='John'
            onChangeText={firstName => setFirstName(firstName)}
            leftIcon={{ type: 'font-awesome', name: 'user-circle', size: 20 }}
            leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
          />
        </View>
      
        <View style={{marginTop: 30}}> 
          <Input
            label='Last Name'
            placeholder='Smith'
            onChangeText={lastName => setLastName(lastName)}
            leftIcon={{ type: 'font-awesome', name: 'user-circle', size: 20 }}
            leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
          />
        </View>
 
        <View style={{marginTop: 30}}> 
          <Input
            label='Email Address'
            placeholder='email@address.com'
            onChangeText={email => setEmail(email)}
            leftIcon={{ type: 'font-awesome', name: 'envelope', size: 20 }}
            keyboardType='email-address'
            leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
          />
        </View>
 
        <View style={{marginTop: 30}}> 
          <Input
            label='Password'
            placeholder='password'
            onChangeText={password => setPassword(password)}
            leftIcon={{ type: 'font-awesome', name: 'lock', size: 24 }}
            secureTextEntry={true}
            leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
          />
        </View>

        <View style={{marginTop: 30}}>
          <Button
            loading={isLoading}
            buttonStyle={{ height: 50 }}
            titleStyle={{ fontWeight: 'bold'}}
            title="Sign Up"
            onPress={() => handleSignUp()}
          />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}


const styles = StyleSheet.create({
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  }
});