import React from 'react'
import { StyleSheet, View, Switch, Picker } from 'react-native'
import { Button } from 'react-native-paper'

import { colors } from '../theme/colors'
import FontText from '../utils/FontText'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'


export default function StatRow(props) {
  let statComponent
  if (props.type == 'switch') {
    statComponent = (
      <View style={styles.statRow}>
        <View style={styles.statTitle}>
          <FontText style={styles.statTitleText}>{props.title}</FontText>
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
          <FontText style={styles.statTitleText}>{props.title}</FontText>
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
          <FontText bold style={styles.statValue}>{numberValue}</FontText>}
          {fraction !== '' &&
          <FontText bold style={styles.statFraction}>{fraction}</FontText>}
        </View>
      );
    } else {
      numberTicker = (
        <View style={styles.statValueContainer}>
          <FontText bold style={styles.statValue}>{props.state}</FontText>
        </View>
      );
    }

    statComponent = (
      <View style={styles.statRow}>
        <View style={styles.statTitle}>
          <FontText style={styles.statTitleText}>{props.title}</FontText>
        </View>
        <View style={styles.statButtons}>
          <Button 
            mode="contained"
            color={colors.buttonMinus}
            style={{ borderRadius: 17}}
            contentStyle={styles.buttonLeft} 
            labelStyle={{ fontSize: 30 }}
            onPress={() => { if (props.state > 0) props.action(props.state - 1) }}
          >
            <FontText bold>-</FontText>
          </Button>
          {numberTicker}
          <Button 
            mode="contained"
            color={colors.buttonPlus}
            style={{ borderRadius: 17}}
            contentStyle={styles.buttonRight}
            labelStyle={{ fontSize: 30 }}
            onPress={() => props.action(props.state + 1)}
          >
            <FontText bold>+</FontText>
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
    width: '95%',
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
    minWidth: wp('15%'),
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: 25,
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
    paddingRight: wp('5%')
  },
  pickerItem: {
    height: 60
  }
})