import React, { useState, useEffect } from 'react'
import { View, Image } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'

import Header from '../components/Header'
import AnalyticsChart from '../components/AnalyticsChart'
import LeagueLeader from '../components/LeagueLeader'
import FontText from '../utils/FontText'
import { BACKEND_API } from 'react-native-dotenv'

import { colors } from '../theme/colors'


const Analytics = props => {
  const [battingAverages, setBattingAverages] = useState([])
  const [ERAs, setERAs] = useState([])

  const [currentBattingAverage, setCurrentBattingAverage] = useState('')
  const [currentERA, setCurrentERA] = useState('')

  const [leagueBattingAverage, setLeagueBattingAverage] = useState(0)
  const [leagueERA, setLeagueERA] = useState(0)

  const [gamesThreshold, setGamesThreshold] = useState(3)

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    buildAnalytics()
  }, [])

  async function buildAnalytics() {
    const battingAverageResponse = await fetch(BACKEND_API + '/api/analytics/batting_average', {
      headers: {
        'Authorization': `Basic ${props.currentUser.token}`
      }
    });
    let battingAverageData = await battingAverageResponse.json()

    setCurrentBattingAverage(battingAverageData.player_avg.toFixed(3))
    setLeagueBattingAverage(battingAverageData.league_avg)
    setBattingAverages(battingAverageData.rolling_batting_averages)


    const earnedRunAverageResponse = await fetch(BACKEND_API + '/api/analytics/earned_run_average', {
      headers: {
        'Authorization': `Basic ${props.currentUser.token}`
      }
    });
    let earnedRunAverageData = await earnedRunAverageResponse.json()

    setCurrentERA(earnedRunAverageData.player_avg.toFixed(2))
    setLeagueERA(earnedRunAverageData.league_avg)
    setERAs(earnedRunAverageData.rolling_earned_run_averages)

    setLoading(false);
  }

  function calcStatMax(addition, leagueValue, highestUserValue) {
    return Math.round(Math.max(leagueValue, highestUserValue) + addition)
  }

  function renderContent() {
    if(!loading) {
      if (battingAverages.length >= gamesThreshold && currentBattingAverage !== '') {
        return (
          <View>
            <View style={{marginTop: 30}}>
              <FontText bold style={{fontSize: 20 }}>Your Batting AVG: {currentBattingAverage}</FontText>
              <AnalyticsChart averages={battingAverages} leagueAverage={leagueBattingAverage} gameFrequency={10} setMax={0.5} />
            </View>
  
            <View style={{marginTop: 30}}>
              <FontText bold style={{fontSize: 20 }}>Your ERA: {currentERA}</FontText>
              <AnalyticsChart averages={ERAs} leagueAverage={leagueERA} gameFrequency={5} setMax={calcStatMax(1, leagueERA, Math.max(...ERAs))} />
            </View>

            <View style={{marginTop: 30}}>
              <FontText bold style={{fontSize: 20 }}>Home Run Leaders</FontText>
              <LeagueLeader stat={'homeRuns'} leaderEmoji={'fire'}></LeagueLeader>
            </View>

            <View style={{marginTop: 30}}>
              <FontText bold style={{fontSize: 20 }}>Stolen Bases Leaders</FontText>
              <LeagueLeader stat={'stolenBases'} leaderEmoji={'dash'}></LeagueLeader>
            </View>

            <View style={{marginTop: 30}}>
              <FontText bold style={{fontSize: 20 }}>Errors Leaders</FontText>
              <LeagueLeader stat={'error'} leaderEmoji={'hankey'}></LeagueLeader>
            </View>
          </View>
        );
      } else {
        return (
          <View style={{height: hp('80%'), paddingTop: wp('18%')}}>
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
              <FontText bold style={{ fontSize: 20, textAlign: 'center'}}>Play at least {gamesThreshold} games to see analytics</FontText>
            </View>
          </View>
        )
      }
    } else {
      return (
          <View style={{height: hp('80%')}}>
            <ActivityIndicator style={{marginTop: hp('20%')}} animating={true} size="large" color={colors.activityIndicator} />
          </View>
      )
    }
  }

  return (
    <Header title="Analytics" disableRefresh> 
      {renderContent()}
    </Header>
  )
}

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser,
  loading: (state.games.loading || state.users.loading),
  games: state.games.games,
  users: state.users.users,
  hasErrors: (state.games.hasErrors || state.users.hasErrors),
})

export default connect(mapStateToProps)(Analytics)
