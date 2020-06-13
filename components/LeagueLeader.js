import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ActivityIndicator, DataTable } from 'react-native-paper'
import { connect } from 'react-redux'

import FontText from '../utils/FontText'
import { colors } from '../theme/colors'

const LeagueLeader = props => {
    const [leagueLeaders, setLeagueLeaders] = useState([])
    
    const maxLeaders = 5

    useEffect(() => {
        buildLeagueLeaders()
    }, [])

    const buildLeagueLeaders = () => {
        let leaders = {}
        let condensedLeaders = []

        for (const user of props.users) {
            let partialName = `${user.firstName} ${user.lastName[0]}`
            let userGames = props.games.filter(game => game.uid == user.uid)

            let accumulatedValue = 0
      
            for (const game of userGames) {
              accumulatedValue += (game[props.stat] ? game[props.stat] : 0)
            }

            if (leaders[accumulatedValue]) {
                leaders[accumulatedValue].push(partialName)
            } else {
                leaders[accumulatedValue] = [partialName]
            }
        }

        if (leaders[0]) {
            delete leaders[0]
        }

        let topValues = Object.keys(leaders)
        topValues.sort(function(a, b){ return b - a})
        topValues = topValues.slice(0, maxLeaders)

        for (let value of topValues) {
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
                            <FontText style={styles.standingsText}>{leader}</FontText>
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
    games: state.games.games,
    users: state.users.users,
  })
  
export default connect(mapStateToProps)(LeagueLeader)