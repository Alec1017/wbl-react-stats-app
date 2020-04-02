import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LineChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';


import Container from '../components/Container';
import { db } from '../Firebase';


export default function Analytics({ route }) {
  const [averages, setAverages] = useState([]);
  const [currentAverage, setCurrentAverage] = useState('');
  const [leagueAverage, setLeagueAverage] = useState(0);
  const [gamesThreshold, setGamesThreshold] = useState(3);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function getGames() {
      const games = await db.collection('games').get()
        .then(snapshot => {
          let games = [];

          snapshot.forEach(doc => { 
            let game = doc.data();
            games.push(game);
          });
          return games;
        });

      try {
        const games = await AsyncStorage.setItem('@games', {
          games,
          cacheTime: Date.now()
        });
        console.log('setting the games...');
      } catch(e) {
        //error
        console.log(e);
      }

      let cumulation = [];
      let total = {
        hits: 0,
        leagueHits: 0,
        atBats: 0,
        leagueAtBats: 0
      };

      for (const game of games) {
        const hits = game.singles + game.doubles + game.triples + game.homeRuns;
        const atBats = hits + game.outs + game.strikeouts;

        // if (game.uid == route.params.uid) {
        if (game.uid == 'RpsfglyXyebDRxfO40ud3PU4iIC2') {
          total.hits += hits;
          total.atBats += atBats;

          if (atBats > 0) {
            cumulation.push(total.hits / total.atBats);
          }
        }

        total.leagueHits += hits;
        total.leagueAtBats += atBats;
      }

      if (total.leagueAtBats > 0) {
        console.log(total);
        setLeagueAverage(total.leagueHits / total.leagueAtBats);
      }

      setAverages(cumulation);
      setCurrentAverage(Number(cumulation[cumulation.length - 1]).toFixed(3));
      setIsLoading(false);
    }

    async function getPersistentGames() {
      try {
        console.log(AsyncStorage)
        // const games = await AsyncStorage.getItem('@games');
        // if (games !== null) { // and the current games were queried less than 30 min ago
        //   // got the value
        //   // now update states
        //   console.log('got the persistent games!')
        //   console.log(games);
        // } else {
        //   getGames();
        // }
      } catch(e) {
        console.log(e);
      }
    }

    //getGames();
    getPersistentGames();
  }, []);
  
  if(!isLoading) {
    if (averages.length > gamesThreshold && currentAverage !== '') {
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
                    data: Array(averages.length).fill(leagueAverage),
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
                // customPaddingLeft: wp('6%')
              }}
            />
          </View>
        </Container>
      );
    } else {
      return (
        <Container type='scroll'>
          <Text style={styles.title}>Analytics</Text>
          <Image
            style={{
              marginTop: 30,
              height: hp('30%'),
              width: wp('80%')
            }}
            resizeMode="contain"
            source={require('../assets/chart.png')}
          />
          <View style={{width: wp('80%')}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Play at least {gamesThreshold} games to see analytics</Text>
          </View>
        </Container>
      );
    }
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