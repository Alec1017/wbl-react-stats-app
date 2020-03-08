import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Button, Input, Overlay } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';

import Container from '../components/Container'
import { db, auth } from '../Firebase';


export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  async function handleLogin() {
    setIsLoading(true);

    try {
      const response = await auth.signInWithEmailAndPassword(email, password);
      
      if (response.user.uid) {
        const user = await db
          .collection('users')
          .doc(response.user.uid)
          .get()

        setIsLoading(false);
  
        props.navigation.navigate('Form', user.data());
      }
      
    } catch (e) {
      setIsLoading(false);
      showMessage({
        message: "\nError",
        description: e.toString(),
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
      <Text style={styles.welcome}>WBL Stats Sheet</Text>
      
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
          title="Login"
          onPress={() => handleLogin()}
        />
      </View>
      <Button type="clear" title="No account yet? Sign up" onPress={() => props.navigation.navigate('SignUp')} />
      <Button type="clear" title="Forgot password?" onPress={() => props.navigation.navigate('PasswordReset')} />

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
    marginBottom: 10,
    fontWeight: 'bold'
  },
  picker: {
    height: 100,
    width: '80%'
  }
});