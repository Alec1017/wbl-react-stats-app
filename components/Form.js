import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Formik } from 'formik';


export default class Form extends Component {
  state = {
    selectedPlayer: this.props.route.params.player
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to the WBL Stats App {this.state.selectedPlayer}!</Text>
        <Formik
          initialValues={{ email: 'enter your email here' }}
          onSubmit={values => console.log(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          )}
        </Formik>
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
  }
});