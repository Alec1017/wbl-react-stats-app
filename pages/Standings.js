import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ActivityIndicator, DataTable } from 'react-native-paper';
import { connect } from 'react-redux'

import Header from '../components/Header';


const Standings = (props) => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    calculateStandings();
  }, []);

  // const onRefresh = useCallback(async () => {
  //   setRefreshing(true);
 
  //     try {
  //       let response = await fetch(
  //         'http://www.mocky.io/v2/5e3315753200008abe94d3d8?mocky-delay=2000ms',
  //       );
  //       let responseJson = await response.json();
  //       console.log(responseJson);
  //       setRefreshing(false)
  //     } catch (error) {
  //       console.error(error);
  //     }
  
  // }, [refreshing]);

  function calculateStandings() {
    let standingsDict = {}
    for (const user of props.users) {
      let fullName = `${user.firstName} ${user.lastName}`;
      let userDivision = user.division;
      let userGames = props.games.filter(game => game.player == fullName)

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
  }

  function renderContent() {
    if(!props.loading && standings.length != 0) {
      return (
        <View>
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
        </View>
      );
    } else {
      return (
        <View style={{height: hp('80%')}}>
          <ActivityIndicator style={{marginTop: hp('20%')}} animating={true} size="large" color="#007bff" />
        </View>
      );
    }
  }

  return (
    <Header title="Standings">
      {renderContent()}
    </Header>
  );
}

const mapStateToProps = state => ({
  loading: (state.games.loading || state.users.loading),
  games: state.games.games,
  users: state.users.users,
  hasErrors: (state.games.hasErrors || state.users.hasErrors),
})

export default connect(mapStateToProps)(Standings)