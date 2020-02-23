import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Button, Input } from 'react-native-elements';

import Container from '../components/Container'
import { db, auth } from '../Firebase';


const users = db.collection('users');

export default class Login extends Component {
  state = {
    selectedPlayer: '',
    players: [],
    email: '',
    password: ''
  };

  componentDidMount() {
    users.get().then(snapshot => {
      let players = [];
      snapshot.forEach(doc => {
        let player = doc.data().firstName + ' ' + doc.data().lastName;
        players.push(player);
      });
      this.setState({players: players});
    });
  }

  render() {
    return (
      <Container>
        <Text style={styles.welcome}>WBL Stats Sheet</Text>
        {/* <Picker 
          style={styles.picker} 
          selectedValue={this.state.selectedPlayer}
          onValueChange={value => this.setState({selectedPlayer: value})}
        >
          {this.state.players.map((value, index) => {
            return <Picker.Item key={index} label={value.toString()} value={value} />
          })}
        </Picker> */}


        <View style={{ width: '80%', marginTop: 30}}> 
          <Input
            label='Email Address'
            placeholder='email@address.com'
            onChangeText={email => this.setState({ email })}
            leftIcon={{ type: 'font-awesome', name: 'envelope', size: 20 }}
            keyboardType='email-address'
            leftIconContainerStyle={{ marginRight: 15, marginLeft: 0, paddingLeft: 0}}
          />
        </View>

        <View style={{ width: '80%', marginTop: 30}}> 
          <Input
            label='Password'
            placeholder='password'
            onChangeText={password => this.setState({ password })}
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
            onPress={() => {
              let values = {
                player: this.state.selectedPlayer, 
                opponents: this.state.players.filter(p => p != this.state.selectedPlayer)
              };
              this.props.navigation.navigate('Form', values);
            }}
          />
        </View>
        <Button type="clear" title="No account yet? Sign up" onPress={() => this.props.navigation.navigate('SignUp')} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold'
  },
  picker: {
    height: 100,
    width: '80%'
  }
});