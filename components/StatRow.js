import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';


export default function StatRow(props) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statTitle}>
        <Text>{props.title}</Text>
      </View>
      <View style={styles.statButtons}>
        <Button 
          buttonStyle={styles.buttonLeft} 
          onPress={() => { if (props.state > 0) props.action(props.state - 1) }} title="-">
        </Button>
        <Text>{props.state}</Text>
        <Button 
          buttonStyle={styles.buttonRight}
          onPress={() => props.action(props.state + 1)} title="+">
        </Button>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomColor: 'rgb(212, 212, 212)',
    borderBottomWidth: 2 
  },
  statTitle: {
    justifyContent: 'flex-start'
  },  
  statButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonLeft: {
    marginRight: 20,
    width: 60,
    height: 60,
  },
  buttonRight: {
    marginLeft: 20,
    width: 60,
    height: 60
  }
});