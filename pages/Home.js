import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Button } from 'react-native-elements';

import Container from '../components/Container'
import { db } from '../Firebase';


const users = db.collection('users');

export default class Home extends Component {
  state = {
    selectedPlayer: '',
    players: []
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
        <Text style={styles.welcome}>Welcome to the WBL Stats App!</Text>
        <Text style={styles.instructions}>To get started, choose who you are.</Text>
        <Picker 
          style={styles.picker} 
          selectedValue={this.state.selectedPlayer}
          onValueChange={value => this.setState({selectedPlayer: value})}
        >
          {this.state.players.map((value, index) => {
            return <Picker.Item key={index} label={value.toString()} value={value} />
          })}
        </Picker>
        <View style={{position: 'absolute', bottom: 20, width:'60%'}}>
          <Button
            buttonStyle={{ height: 50 }}
            titleStyle={{ fontWeight: 'bold'}}
            title="Continue"
            onPress={() => {
              let values = {
                player: this.state.selectedPlayer, 
                opponents: this.state.players.filter(p => p != this.state.selectedPlayer)
              };
              this.props.navigation.navigate('Form', values);
            }}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  picker: {
    height: 100,
    width: '80%'
  }
});