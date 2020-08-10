import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ActivityIndicator, DataTable } from 'react-native-paper'
import { connect } from 'react-redux'

import Header from '../components/Header'
import FontText from '../utils/FontText'
import { BACKEND_API } from 'react-native-dotenv'

import { colors } from '../theme/colors'


const Standings = props => {
  const [standings, setStandings] = useState([])

  useEffect(() => {
    async function fetchStandings() {
      try {
        const standingsResponse = await fetch(BACKEND_API + '/api/standings', {
          headers: {
            'Authorization': `Basic ${props.currentUser.token}`
          }
        });
        let standingsData = await standingsResponse.json()

        let processedStandings = processStandings(standingsData)

        setStandings(processedStandings)
      } catch(error) {
        console.log(error)
      }
    }

    fetchStandings()
  }, [])

  function processStandings(data) {
    let standingsTuple = []
    for ([div, row] of Object.entries(data)) {
      standingsTuple.push([div, row])
    }
    
    standingsTuple.sort(function(a, b){ return a[0] - b[0]});

    return standingsTuple
  }

  function renderContent() {
    if(standings.length != 0) {
      return (
        <View>
          {standings.map(([division, row], i) => {
            row.sort(function(a, b){ return b[1] - a[1]})

            return (
              <DataTable key={i} style={{marginTop: 30, width: wp('90%')}}>
                <DataTable.Header>
                  <DataTable.Title style={{minWidth: wp('30%')}}>
                    <FontText style={styles.standingsText}>Division {division[0]}</FontText>
                  </DataTable.Title>
                  <DataTable.Title numeric>
                    <FontText style={styles.standingsText}>W</FontText>
                  </DataTable.Title>
                  <DataTable.Title numeric>
                    <FontText style={styles.standingsText}>L</FontText>
                  </DataTable.Title>
                </DataTable.Header>

                {row.map((row, i) => {
                  return (
                    <DataTable.Row key={i}>
                      <DataTable.Cell style={{minWidth: wp('30%')}}>
                        <FontText style={styles.standingsText}>{row[0]}</FontText>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <FontText style={styles.standingsText}>{row[1]}</FontText>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <FontText style={styles.standingsText}>{row[2]}</FontText>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            )
          })}
        </View>
      );
    } else {
      return (
        <View style={{height: hp('80%')}}>
          <ActivityIndicator style={{marginTop: hp('20%')}} animating={true} size="large" color={colors.activityIndicator} />
        </View>
      )
    }
  }

  return (
    <Header title="Standings" disableRefresh={true}>
      {renderContent()}
    </Header>
  )
}

const styles = StyleSheet.create({
  standingsText: {
    fontSize: 17
  }
})

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser,
  loading: (state.games.loading || state.users.loading),
  games: state.games.games,
  users: state.users.users,
  hasErrors: (state.games.hasErrors || state.users.hasErrors),
})

export default connect(mapStateToProps)(Standings)