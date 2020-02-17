import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';


export default function StatRow(props) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statTitle}>
        <Text style={styles.statTitleText}>{props.title}</Text>
      </View>
      <View style={styles.statButtons}>
        <Button 
          buttonStyle={styles.buttonLeft} 
          titleStyle={{ fontWeight: 'bold', fontSize: 30 }}
          onPress={() => { if (props.state > 0) props.action(props.state - 1) }} title="-">
        </Button>
        <View style={styles.statValueContainer}>
          <Text style={styles.statValue}>{props.state}</Text>
        </View>
        <Button 
          buttonStyle={styles.buttonRight}
          titleStyle={{ fontWeight: 'bold', fontSize: 30}}
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
    justifyContent: 'center'
  },  
  statTitleText: {
    fontSize: 20,
  },
  statButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonLeft: {
    width: 60,
    height: 60
  },
  buttonRight: {
    width: 60,
    height: 60,
    backgroundColor: 'rgb(6, 53, 132)'
  },
  statValueContainer: {
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});