import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ActivityIndicator, DataTable } from 'react-native-paper';
import ReactNativeParallaxHeader from 'react-native-parallax-header';

import Container from '../components/Container';


export default function Standings(props) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    calculateStandings();
  }, []);

  function calculateStandings() {
    let standingsDict = {}
    for (const user of props.route.params.users) {
      let fullName = `${user.firstName} ${user.lastName}`;
      let userDivision = user.division;
      let userGames = props.route.params.games.filter(game => game.player == fullName)

      let gamesWon = 0;
      let gamesLost = 0;

      for (const game of userGames) {
        if (game.isCaptain && game.isGameWon) {
          gamesWon++;
        }

        if (game.isCaptain && !game.isGameWon) {
          gamesLost++;
        }
      }

      if (standingsDict[userDivision]) {
        standingsDict[userDivision].push([fullName, gamesWon, gamesLost])
      } else {
        standingsDict[userDivision] = [[fullName, gamesWon, gamesLost]]
      }
    }

    let standingsTuple = [];
    for ([div, row] of Object.entries(standingsDict)) {
      standingsTuple.push([div, row]);
    }
    
    standingsTuple.sort(function(a, b){ return a[0] - b[0]});
    setStandings(standingsTuple);
    setIsLoading(false);
  }

  function renderContent() {
    if(!isLoading && standings.length != 0) {
      return (
        <Container containerType='scroll'>
          {standings.map(([division, row], i) => {

            row.sort(function(a, b){ return b[1] - a[1]});

            return (
              <DataTable key={i} style={{marginTop: 30, width: wp('90%')}}>
                <DataTable.Header>
                  <DataTable.Title>Division {division[0]}</DataTable.Title>
                  <DataTable.Title numeric>W</DataTable.Title>
                  <DataTable.Title numeric>L</DataTable.Title>
                </DataTable.Header>

                {row.map((row, i) => {
                  return (
                    <DataTable.Row key={i}>
                      <DataTable.Cell>{row[0]}</DataTable.Cell>
                      <DataTable.Cell numeric>{row[1]}</DataTable.Cell>
                      <DataTable.Cell numeric>{row[2]}</DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            );
          })}
        </Container>
      );
    } else {
      return (
        <Container>
          <View style={{height: hp('80%')}}>
            <ActivityIndicator style={{marginTop: hp('20%')}} animating={true} size="large" color="#007bff" />
          </View>
        </Container>
      );
    }
  }

  const headerTitle = (
    <View>
      <Text style={styles.title}>Standings</Text>
    </View>
  );

  return (
    <ReactNativeParallaxHeader
      title={headerTitle}
      headerMaxHeight={hp('23%')}
      headerMinHeight={hp('10%')}
      alwaysShowTitle={true}
      alwaysShowNavBar={false}
      renderContent={renderContent}
    /> 
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold'
  }
});