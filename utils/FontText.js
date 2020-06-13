import React from 'react'
import { Text, StyleSheet } from 'react-native'


const FontText = props => {
    if (props.bold) {
        return <Text style={[styles.Bold, props.style]}>{props.children}</Text>
    } else {
        return <Text style={[styles.Regular, props.style]}>{props.children}</Text>
    }
}

const styles = StyleSheet.create({
    Regular: {fontFamily: 'Roboto'},
    Bold: {fontFamily: 'RobotoBold'}
})

export default FontText