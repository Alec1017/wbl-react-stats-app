import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ActivityIndicator, DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import Emoji from 'react-native-emoji'

import FontText from '../utils/FontText'
import { colors } from '../theme/colors'
import { BACKEND_API } from 'react-native-dotenv'

const LeagueLeader = props => {
    const [leagueLeaders, setLeagueLeaders] = useState([])
    const [leaderName, setLeaderName] = useState('')
    
    const maxLeaders = 5

    useEffect(() => {
      buildLeagueLeaders()
    }, [])

    async function buildLeagueLeaders() {
      const leaderboardResponse = await fetch(BACKEND_API + `/api/analytics/leaderboard/${props.stat}`, {
        headers: {
          'Authorization': `Basic ${props.currentUser.token}`
        }
      });
      let leaderboardData = await leaderboardResponse.json()

      let leaders = {}
      let condensedLeaders = []

      for (const player of leaderboardData) {
        let partialName = `${player.first_name} ${player.last_name[0]}`

        if (leaders[player.data]) {
          leaders[player.data].push(partialName)
        } else {
          leaders[player.data] = [partialName]
        }

      }

      if (leaders[0]) {
        delete leaders[0]
      }

      let topValues = Object.keys(leaders)
      topValues.sort(function(a, b){ return b - a})
      topValues = topValues.slice(0, maxLeaders)

      for (let value of topValues) {
        if (value == Math.max(...topValues) && leaders[value].length == 1) {
          setLeaderName(leaders[value])
        }

        condensedLeaders.push([leaders[value].join(', '), value])
      }

      setLeagueLeaders(condensedLeaders)
    }

    if (leagueLeaders.length !== 0) {
        return (
            <DataTable style={{ width: wp('90%')}}>
                {leagueLeaders.map(([leader, value], i) => {
                    return (
                    <DataTable.Row key={i}>
                        <DataTable.Cell style={{minWidth: wp('50%')}}>
                            <FontText style={styles.standingsText}>{leader} </FontText>
                            {leaderName == leader &&
                                <Emoji name={props.leaderEmoji} style={{fontSize: 17}} />}
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <FontText style={styles.standingsText}>{value}</FontText>
                        </DataTable.Cell>
                    </DataTable.Row>
                    );
                })}
            </DataTable>
        )
    } else {
        return (
            <View style={{height: hp('80%')}}>
              <ActivityIndicator style={{marginTop: hp('20%')}} animating={true} size="large" color={colors.activityIndicator} />
            </View>
          )
    }
}

const styles = StyleSheet.create({
    standingsText: {
      fontSize: 17
    }
  })

const mapStateToProps = state => ({
    currentUser: state.currentUser.currentUser,
  })
  
export default connect(mapStateToProps)(LeagueLeader)