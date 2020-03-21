import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { TextInput, Button } from 'react-native-paper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
      <Text style={styles.title}>Sign In</Text>

      <View style={{ width: '80%' }}>
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

        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button 
            uppercase={false} 
            color='#007bff'
            labelStyle={{ marginRight: 0}}
            onPress={() => props.navigation.navigate('PasswordReset')}>Forgot password?</Button>
        </View>

        <Button
          loading={isLoading}
          mode='contained'
          color='#007bff'
          onPress={() => handleLogin()}
          style={{ marginTop: 15 }}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          {isLoading ? 'Loading' : 'Login'}
        </Button>

        <Button 
          uppercase={false} 
          color='#007bff' 
          style={{ marginTop: 10 }}
          onPress={() => props.navigation.navigate('SignUp')}
        >
          No account yet? Sign Up
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
    fontWeight: 'bold'
  },
  picker: {
    height: 100,
    width: '80%'
  }
});