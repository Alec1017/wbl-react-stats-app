import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';


export default function AnalyticsChart(props) {
  return (
    <LineChart
      data={{
        legend: ['You', 'League Average'],
        labels: [...Array(props.averages.length).keys()].map(x => ++x % props.gameFrequency == 0 ? x : ''), // displays every other game label
        datasets: [
          {
            data: props.averages,
            withDots: false,
            color: () => 'rgba(255, 255, 255, 0.8)'
          },
          {
            data: Array(props.averages.length).fill(props.leagueAverage),
            withDots: false,
            color: () => 'rgba(0, 0, 0, 0.3)'
          }
        ]
      }}
      width={wp('90%')} 
      height={220}
      withInnerLines={false}
      withShadow={false}
      fromZero={true}
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
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
}