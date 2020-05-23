import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';


export default function Container(props) {
  let container;
  if (props.containerType == 'scroll') {
    container = <ScrollView {...props} contentContainerStyle={styles.scrollContainer}>{props.children}</ScrollView>;
  } else {
    container = <View style={styles.container}>{props.children}</View>
  }

  return (container)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});