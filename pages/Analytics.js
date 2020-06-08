import React, { useState, useEffect } from 'react'
import { Text, View, Image } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'

import Header from '../components/Header'
import AnalyticsChart from '../components/AnalyticsChart'

import { colors } from '../theme/colors'


const Analytics = props => {
  const [battingAverages, setBattingAverages] = useState([])
  const [ERAs, setERAs] = useState([])

  const [currentBattingAverage, setCurrentBattingAverage] = useState('')
  const [currentERA, setCurrentERA] = useState('')

  const [leagueBattingAverage, setLeagueBattingAverage] = useState(0)
  const [leagueERA, setLeagueERA] = useState(0)

  const [gamesThreshold, setGamesThreshold] = useState(5)


  useEffect(() => {
    buildAnalytics()
  }, [])

  async function buildAnalytics() {
    let cumulation = []
    let cumulationERA = []
    let total = {
      hits: 0,
      leagueHits: 0,
      atBats: 0,
      leagueAtBats: 0,
      earnedRuns: 0,
      leagueEarnedRuns: 0,
      inningsPitched: 0,
      leagueInningsPitched: 0
    }

    for (const game of props.games) {
      const hits = game.singles + game.doubles + game.triples + game.homeRuns
      const atBats = hits + game.outs + game.strikeouts
      const earnedRuns = game.earnedRuns
      const inningsPitched = game.inningsPitched

      if (game.uid == props.currentUser.uid) {
        total.hits += hits
        total.atBats += atBats
        total.earnedRuns += earnedRuns
        total.inningsPitched += inningsPitched

        if (atBats > 0) {
          cumulation.push(total.hits / total.atBats)
        }

        if (inningsPitched > 0) {
          cumulationERA.push((total.earnedRuns * 3) / total.inningsPitched)
        }
      }

      total.leagueHits += hits
      total.leagueAtBats += atBats
      total.leagueEarnedRuns += earnedRuns
      total.leagueInningsPitched += inningsPitched
    }

    if (total.leagueAtBats > 0) {
      setLeagueBattingAverage(total.leagueHits / total.leagueAtBats)
    }

    if (total.leagueInningsPitched > 0) {
      setLeagueERA((total.leagueEarnedRuns * 3) / total.leagueInningsPitched)
    }

    setBattingAverages(cumulation)
    setERAs(cumulationERA)
    setCurrentBattingAverage(Number(cumulation[cumulation.length - 1]).toFixed(3))
    setCurrentERA(Number(cumulationERA[cumulationERA.length - 1]).toFixed(2))
  }

  function calcStatMax(addition, leagueValue, highestUserValue) {
    return Math.round(Math.max(leagueValue, highestUserValue) + addition)
  }

  function renderContent() {
    if(!props.loading) {
      if (battingAverages.length >= gamesThreshold && currentBattingAverage !== '') {
        return (
          <View>
            <View style={{marginTop: 30}}>
              <Text style={{fontSize: 20, fontWeight: 'bold' }}>Batting AVG: {currentBattingAverage}</Text>
              <AnalyticsChart averages={battingAverages} leagueAverage={leagueBattingAverage} gameFrequency={5} setMax={1} />
            </View>
  
            <View style={{marginTop: 30}}>
              <Text style={{fontSize: 20, fontWeight: 'bold' }}>ERA: {currentERA}</Text>
              <AnalyticsChart averages={ERAs} leagueAverage={leagueERA} gameFrequency={5} setMax={calcStatMax(2, leagueERA, Math.max(...ERAs))} />
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
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Play at least {gamesThreshold} games to see analytics</Text>
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
    <Header title="Analytics" disableRefresh={true}> 
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
