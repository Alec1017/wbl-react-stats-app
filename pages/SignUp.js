import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Input, Overlay } from 'react-native-elements';

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
      const response = await auth.createUserWithEmailAndPassword(email, password);

      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          isAdmin: false
        }

        setIsLoading(false);
  
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

      <Overlay 
          isVisible={isLoading}
          width="100%"
          height="100%"
          overlayBackgroundColor="rgba(0,0,0,0.1)"
        >
          <View style={{ flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </Overlay>
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