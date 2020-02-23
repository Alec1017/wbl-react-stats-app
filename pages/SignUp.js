import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';

import Container from '../components/Container';
import { db, auth } from '../Firebase';


export default function SignUp(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    try {
      const response = await auth.createUserWithEmailAndPassword(email, password);

      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email
        }
  
        db.collection('users')
          .doc(response.user.uid)
          .set(user)
  
        props.navigation.navigate('Form', user);
      }
    } catch (e) {
      Alert.alert(e.toString());
    }
  }
  
  return (
    <Container>
      <Text style={styles.welcome}>WBL Stats Sheet</Text>

      <View style={{ width: '80%', marginTop: 30}}> 
        <Input
          label='First Name'
          placeholder='John'
          onChangeText={firstName => setFirstName(firstName)}
          leftIcon={{ type: 'font-awesome', name: 'user-circle', size: 20 }}
          leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
        />
      </View>

      <View style={{ width: '80%', marginTop: 30}}> 
        <Input
          label='Last Name'
          placeholder='Smith'
          onChangeText={lastName => setLastName(lastName)}
          leftIcon={{ type: 'font-awesome', name: 'user-circle', size: 20 }}
          leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
        />
      </View>

      <View style={{ width: '80%', marginTop: 30}}> 
        <Input
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          leftIcon={{ type: 'font-awesome', name: 'envelope', size: 20 }}
          keyboardType='email-address'
          leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
        />
      </View>

      <View style={{ width: '80%', marginTop: 30}}> 
        <Input
          label='Password'
          placeholder='password'
          onChangeText={password => setPassword(password)}
          leftIcon={{ type: 'font-awesome', name: 'lock', size: 24 }}
          secureTextEntry={true}
          leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
        />
      </View>
      
      <View style={{width:'80%', marginTop: 30}}>
        <Button
          buttonStyle={{ height: 50 }}
          titleStyle={{ fontWeight: 'bold'}}
          title="Sign Up"
          onPress={() => handleSignUp()}
        />
      </View>
    </Container>
  );
}


const styles = StyleSheet.create({
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold'
  }
});