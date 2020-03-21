import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { TextInput } from 'react-native-paper';

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
      <Text style={styles.welcome}>WBL Stats Sheet</Text>
      
      <View style={{ width: '80%', marginTop: 30}}> 
        <TextInput 
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          keyboardType='email-address'
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />
      </View>

      <View style={{ width: '80%', marginTop: 30}}> 
        <TextInput 
          label='Password'
          placeholder='password'
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
          selectionColor='rgb(6, 53, 132)'
          underlineColor='#7CA1B4'
          theme={{ colors: { primary: 'rgb(6, 53, 132)' } }}
        />
      </View>
      
      <View style={{width:'80%', marginTop: 30}}>
        <Button
          loading={isLoading}
          buttonStyle={{ height: 50 }}
          titleStyle={{ fontWeight: 'bold'}}
          title="Login"
          onPress={() => handleLogin()}
        />
      </View>

      <Button type="clear" title="No account yet? Sign up" onPress={() => props.navigation.navigate('SignUp')} />
      <Button type="clear" title="Forgot password?" onPress={() => props.navigation.navigate('PasswordReset')} />
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