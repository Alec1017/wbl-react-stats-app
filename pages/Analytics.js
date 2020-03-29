import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LineChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import LottieView from 'lottie-react-native';


import Container from '../components/Container';
import { db } from '../Firebase';


export default function Analytics({ route }) {
  const [averages, setAverages] = useState([]);
  const [currentAverage, setCurrentAverage] = useState('');


  useEffect(() => {
    async function getGames() {
      // db.collection('games').where('uid', '==', route.params.uid).get()
      const games = await db.collection('games').where('uid', '==', 'RpsfglyXyebDRxfO40ud3PU4iIC2').get()
        .then(snapshot => {
          let games = [];

          snapshot.forEach(doc => { 
            let game = doc.data();
            games.push(game);
          });
          return games;
        });

      let cumulation = [];
      let total = {
        hits: 0,
        atBats: 0
      };

      for (const game of games) {
        const hits = game.singles + game.doubles + game.triples + game.homeRuns;
        const atBats = hits + game.outs + game.strikeouts;

        total.hits += hits;
        total.atBats += atBats;

        if (atBats > 0) {
          cumulation.push(total.hits / total.atBats);
        }

      }

      setAverages(cumulation);
      setCurrentAverage(Number(cumulation[cumulation.length - 1]).toFixed(3));
    }

    getGames();
  }, []);

  if (averages.length < 5) {
    return (
      <Container type='scroll'>
        <Text style={styles.title}>Analytics</Text>
        <LottieView
          autoPlay
          loop={false}
          style={{
            width: wp('80%')
          }}
          speed={2}
          source={require('../assets/graph.json')}
        />
        <View style={{width: wp('80%')}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Play at least 5 games to see analytics</Text>
        </View>
      </Container>
    )
  }
  

  if (averages.length > 0 && currentAverage !== '') {
    return (
      <Container type='scroll'>
        <Text style={styles.title}>Analytics</Text>
  
        <View style={{marginTop: 30}}>
        <Text style={{fontSize: 20, fontWeight: 'bold' }}>Batting AVG: {currentAverage}</Text>
          <LineChart
            data={{
              legend: ['You', 'League Average'],
              labels: [...Array(averages.length).keys()].map(x => ++x % 2 == 0 ? x : ''), // displays every other game label
              datasets: [
                {
                  data: averages,
                  withDots: false,
                  color: () => 'rgba(255, 255, 255, 0.8)'
                },
                {
                  data: Array(averages.length).fill(.333),
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
              borderRadius: 16
            }}
          />
        </View>
      </Container>
    );
  } else {
    return (
      <Container type='scroll'>
        <Text style={styles.title}>Analytics</Text>
        <ActivityIndicator style={{marginTop: hp('20%')}} animating={true} size="large" color="#007bff" />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
    fontWeight: 'bold'
  }
});