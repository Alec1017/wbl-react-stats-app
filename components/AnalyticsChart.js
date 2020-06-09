import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { colors } from '../theme/colors'


export default function AnalyticsChart(props) {
 
  // Limits the entire data set to a specific number of evenly indexed values
  function reduce(reductionValue, values) {
    if (values.length <= reductionValue) {
      return values
    }

    let averageIndex = values.length / reductionValue;
    let averageIndices = []
    for (let i = 1; i <= reductionValue; i++) {
      averageIndices.push(i * averageIndex)
    }
    
    let roundedAverageIndices = averageIndices.map(x => Math.round(x) - 1)

    let reducedValues = []
    for (let index of roundedAverageIndices) {
      reducedValues.push(values[index])
    }

    return reducedValues
  }

  return (
    <LineChart
      data={{
        legend: ['You', 'League Average'],
        labels: [...Array(props.averages.length).keys()].map(x => ++x % props.gameFrequency == 0 ? x : ''), // displays every other game label
        datasets: [
          {
            data: reduce(10, props.averages),
            withDots: false,
            color: () => 'rgba(255, 255, 255)'
          },
          {
            data: Array(props.averages.length).fill(props.leagueAverage),
            withDots: false,
            color: () => 'rgba(0, 0, 0, 0.5)'
          }
        ]
      }}
      width={wp('90%')} 
      height={220}
      withInnerLines={false}
      withShadow={false}
      fromZero={true}
      setMax={props.setMax}
      chartConfig={{
        backgroundColor: colors.analyticsBackground,
        backgroundGradientFrom: colors.analyticsBackground,
        backgroundGradientTo: colors.analyticsBackground,
        decimalPlaces: 3,
        color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
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