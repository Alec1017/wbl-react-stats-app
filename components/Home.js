import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Button } from 'react-native-elements';


const players = [
  'Dan Roche', 'Nick Brown', 'Zack Lacey',
  'Alec DiFederico', 'Ryan Brown', 'Jonathan Sullivan',
  'Mike Iula', 'Dan Sadek', 'Markus Letaif'
];

export default class Home extends Component {
  state = {
    selectedPlayer: players[0]
  };

  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to the WBL Stats App!</Text>
        <Text style={styles.instructions}>To get started, choose who you are.</Text>
        <Picker 
          style={styles.picker} 
          selectedValue={this.state.selectedPlayer}
          onValueChange={value => this.setState({selectedPlayer: value})}
        >
          {players.map((value, index) => {
            return <Picker.Item key={index} label={value.toString()} value={value} />
          })}
        </Picker>
        <View style={{position: 'absolute', bottom: 20, width:'60%'}}>
          <Button
            title="Continue"
            onPress={() => this.props.navigation.navigate('Form', {player: this.state.selectedPlayer})}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
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