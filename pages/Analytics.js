import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LineChart } from 'react-native-chart-kit';


import Container from '../components/Container';
import { db } from '../Firebase';


export default function Analytics(props) {
  return (
    <Container type='scroll'>
      <Text style={styles.title}>Analytics</Text>

      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 20, fontWeight: 'bold' }}>Batting AVG</Text>
        <LineChart
          data={{
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [
              {
                data: [
                  Math.random() * 1,
                  Math.random() * 1,
                  Math.random() * 1,
                  Math.random() * 1,
                  Math.random() * 1,
                  Math.random() * 1
                ]
              }
            ]
          }}
          width={wp('90%')} // from react-native
          height={220}
          withInnerLines={false}
          fromZero={true}
          yAxisInterval={2} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#007bff",
            backgroundGradientFrom: "#007bff",
            backgroundGradientTo: "#007bff",
            decimalPlaces: 3, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "3",
              strokeWidth: "2",
              stroke: "#007bff"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
    fontWeight: 'bold'
  }
});