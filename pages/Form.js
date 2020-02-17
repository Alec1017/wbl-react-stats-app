import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';

import Container from '../components/Container';
import StatRow from '../components/StatRow';


export default function Form(props) {
  const [selectedPlayer, setSelectedPlayer] = useState(props.route.params.player);
  const [hits, setHits] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);

  return (
    <Container>
      <Text style={styles.welcome}> Hey {selectedPlayer}! Enter your stats</Text>
      <StatRow title="Hits" state={hits} action={setHits} />
      <StatRow title="Strikeouts" state={strikeouts} action={setStrikeouts} />
      <View style={{position: 'absolute', bottom: 20, width:'60%'}}>
          <Button
            title="Submit"
            onPress={() => Alert.alert('Hits: ' + hits.toString()  + '\nStrikeouts: ' + strikeouts.toString() )}
          />
        </View>
    </Container>
  )
}


const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});