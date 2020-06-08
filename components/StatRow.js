import React from 'react'
import { StyleSheet, Text, View, Switch, Picker } from 'react-native'
import { Button } from 'react-native-paper'

import { colors } from '../theme/colors'


export default function StatRow(props) {
  let statComponent
  if (props.type == 'switch') {
    statComponent = (
      <View style={styles.statRow}>
        <View style={styles.statTitle}>
          <Text style={styles.statTitleText}>{props.title}</Text>
        </View>
        <View style={styles.statButtons}>
          <View style={styles.switchContainer}>
            <Switch
              value={props.state}
              onValueChange={() => props.action(!props.state)}
            />
          </View>
        </View>
      </View>
    )
  } else if (props.type == 'picker') {
    statComponent = (
      <View style={styles.statRow}>
        <View style={styles.statTitle}>
          <Text style={styles.statTitleText}>{props.title}</Text>
        </View>
        <View style={styles.statButtons}>
          <Picker 
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={props.state}
            onValueChange={value => props.action(value)}
          >
            {props.opponents.map((value, index) => {
              return <Picker.Item key={index} label={value.toString()} value={value} />
            })}
          </Picker>
        </View>
      </View>
    )
  } else {
    let numberTicker
    if (props.numberType == 'fractions') {
      let numberValue = props.state
      let remainder = ''
      let fraction = ''
      if (props.state % 3 != 0) {
        numberValue = Math.floor(props.state / 3);
        numberValue = numberValue == 0 ? '' : numberValue
        remainder = props.state % 3
        fraction = `${remainder}/3`
      } else {
        numberValue = props.state / 3
      }

      numberTicker = (
        <View style={styles.statValueContainer}>
          {numberValue !== '' && 
          <Text style={styles.statValue}>{numberValue}</Text>}
          {fraction !== '' &&
          <Text style={styles.statFraction}>{fraction}</Text>}
        </View>
      );
    } else {
      numberTicker = (
        <View style={styles.statValueContainer}>
          <Text style={styles.statValue}>{props.state}</Text>
        </View>
      );
    }

    statComponent = (
      <View style={styles.statRow}>
        <View style={styles.statTitle}>
          <Text style={styles.statTitleText}>{props.title}</Text>
        </View>
        <View style={styles.statButtons}>
          <Button 
            mode="contained"
            color={colors.buttonMinus}
            contentStyle={styles.buttonLeft} 
            labelStyle={{ fontWeight: 'bold', fontSize: 30 }}
            onPress={() => { if (props.state > 0) props.action(props.state - 1) }}
          >
            -
          </Button>
          {numberTicker}
          <Button 
            mode="contained"
            color={colors.buttonPlus}
            contentStyle={styles.buttonRight}
            labelStyle={{ fontWeight: 'bold', fontSize: 30 }}
            onPress={() => props.action(props.state + 1)}
          >
            +
          </Button>
        </View>
      </View>
    )
  }

  return statComponent
}


const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    width: '90%',
    paddingLeft: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomColor: colors.rowDivider,
    borderBottomWidth: 1
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
    height: 60,
    alignSelf: 'center'
  },
  buttonRight: {
    width: 60,
    height: 60,
    alignSelf: 'center'
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
  },
  statFraction: {
    fontSize: 20, 
    fontWeight: 'bold'
  },
  switchContainer: {
    justifyContent: 'center',
    height: 60
  },
  picker: {
    height: 60,
    width: '80%',
    paddingRight: 20
  },
  pickerItem: {
    height: 60
  }
})