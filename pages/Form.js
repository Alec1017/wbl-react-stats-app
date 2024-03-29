import React, { useState, useEffect } from 'react'
import * as Haptics from 'expo-haptics'
import { StyleSheet, View, Alert } from 'react-native'
import { Button } from 'react-native-paper'
import { showMessage } from 'react-native-flash-message'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LottieView from 'lottie-react-native'
import { connect } from 'react-redux'

import Header from '../components/Header'
import StatRow from '../components/StatRow'
import FontText from '../utils/FontText'
import { BACKEND_API } from 'react-native-dotenv'

import { colors } from '../theme/colors'


const Form = props => {
  const [singles, setSingles] = useState(0)
  const [doubles, setDoubles] = useState(0)
  const [triples, setTriples] = useState(0)
  const [homeRuns, setHomeRuns] = useState(0)
  const [hitByPitch, setHitByPitch] = useState(0)
  const [baseOnBalls, setBaseOnBalls] = useState(0)
  const [runsBattedIn, setRunsBattedIn] = useState(0)
  const [strikeouts, setStrikeouts] = useState(0)
  const [stolenBases, setStolenBases] = useState(0)
  const [caughtStealing, setCaughtStealing] = useState(0)
  const [outs, setOuts] = useState(0)

  const [inningsPitched, setInningsPitched] = useState(0)
  const [earnedRuns, setEarnedRuns] = useState(0)
  const [runs, setRuns] = useState(0)
  const [pitchingStrikeouts, setPitchingStrikeouts] = useState(0)
  const [pitchingBaseOnBalls, setPitchingBaseOnBalls] = useState(0)
  const [saves, setSaves] = useState(0)
  const [blownSaves, setBlownSaves] = useState(0)
  const [win, setWin] = useState(0)
  const [loss, setLoss] = useState(0)

  const [error, setError] = useState(0)

  const [player, setPlayer] = useState(props.currentUser.firstName + ' ' + props.currentUser.lastName)
  const [uid, setUID] = useState(props.currentUser.uid)
  const [isCaptain, setIsCaptain] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [winnerScore, setWinnerScore] = useState(0)
  const [loserScore, setLoserScore] = useState(0)
  const [selectedOpponent, setSelectedOpponent] = useState('')
  const [opponents, setOpponents] = useState([])
  const [totalInnings, setTotalInnings] = useState(3)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchOpponents() {
      try {
        const opponentResponse = await fetch(BACKEND_API + '/api/opponents', {
          headers: {
            'Authorization': `Basic ${props.currentUser.token}`
          }
        });
        const opponentData = await opponentResponse.json()
  
        setSelectedOpponent(opponentData ? opponentData[0][0] : '')
        setOpponents(opponentData)
      } catch(error) {
        console.log(error)
      }
    }

    fetchOpponents()
  }, [])

  async function addGame() {
    setIsLoading(true)

    const gameData = {
      player_id: props.currentUser.uid,
      singles: singles,
      doubles: doubles,
      triples: triples,
      home_runs: homeRuns,
      strikeouts: strikeouts,
      outs: outs,
      base_on_balls: baseOnBalls,
      hit_by_pitch: hitByPitch,
      runs_batted_in: runsBattedIn,
      error: error,
      stolen_bases: stolenBases,
      caught_stealing: caughtStealing,
      innings_pitched: inningsPitched,
      earned_runs: earnedRuns,
      runs: runs,
      pitching_strikeouts: pitchingStrikeouts,
      pitching_base_on_balls: pitchingBaseOnBalls,
      saves: saves,
      blown_saves: blownSaves,
      win: win,
      loss: loss,
      opponent_id: (isCaptain ? selectedOpponent : null),
      captain: isCaptain,
      game_won: isGameWon,
      winner_score: winnerScore,
      loser_score: loserScore,
      total_innings: totalInnings
    }

    const animation = (
      <LottieView
        autoPlay
        loop={false}
        style={{
          width: 70,
          height: 70
        }}
        source={require('../assets/checkmark.json')}
      />
    )

    try {
      const addGameResponse = await fetch(BACKEND_API + '/api/add_game', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${props.currentUser.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      });
      const addGameData = await addGameResponse.json();

      if (!addGameData.success) {
        throw addGameData.message
      }

      showMessage({
        message: "\nStats submitted",
        description: animation,
        type: "success",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {alignSelf: 'center', justifyContent: 'center'},
        duration: 2000
      })

      resetState()
    } catch (error) {
      showMessage({
        message: "\nStats not submitted",
        description: error,
        type: "danger",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {alignSelf: 'center', justifyContent: 'center'},
        duration: 2000
      })
    }

    setIsLoading(false)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  function submitConfirmation() {
    Alert.alert(
      'Are you sure you are ready to submit?',
      '',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => addGame()}
      ]
    )
  }

  function resetState() {
    setSingles(0)
    setDoubles(0)
    setTriples(0)
    setHomeRuns(0)
    setHitByPitch(0)
    setBaseOnBalls(0)
    setRunsBattedIn(0)
    setStrikeouts(0)
    setStolenBases(0)
    setCaughtStealing(0)
    setOuts(0)

    setInningsPitched(0)
    setEarnedRuns(0)
    setRuns(0)
    setPitchingStrikeouts(0)
    setPitchingBaseOnBalls(0)
    setSaves(0)
    setBlownSaves(0)
    setWin(0)
    setLoss(0)

    setError(0)
    
    setIsCaptain(false)
    setIsGameWon(false)
    setWinnerScore(0)
    setLoserScore(0)
    setSelectedOpponent(opponents[0])
    setTotalInnings(3)
  }

  return (
    <Header title="Enter your stats" disableRefresh={true}> 
      <View style={styles.container}>
        <FontText bold style={styles.categoryText}>Hitting</FontText>
        
        <StatRow title="1B" state={singles} action={setSingles} />
        <StatRow title="2B" state={doubles} action={setDoubles} />
        <StatRow title="3B" state={triples} action={setTriples} />
        <StatRow title="HR" state={homeRuns} action={setHomeRuns} />
        <StatRow title="K" state={strikeouts} action={setStrikeouts} />
        <StatRow title="OUTS" state={outs} action={setOuts} />
        <StatRow title="HBP" state={hitByPitch} action={setHitByPitch} />
        <StatRow title="BB" state={baseOnBalls} action={setBaseOnBalls} />
        <StatRow title="RBI" state={runsBattedIn} action={setRunsBattedIn} />
        <StatRow title="SB" state={stolenBases} action={setStolenBases} />
        <StatRow title="CS" state={caughtStealing} action={setCaughtStealing} />

        <FontText bold style={styles.categoryText}>Pitching</FontText>

        <StatRow title="IP" numberType="fractions" state={inningsPitched} action={setInningsPitched} />
        <StatRow title="ER" state={earnedRuns} action={setEarnedRuns} />
        <StatRow title="R" state={runs} action={setRuns} />
        <StatRow title="K" state={pitchingStrikeouts} action={setPitchingStrikeouts} />
        <StatRow title="BB" state={pitchingBaseOnBalls} action={setPitchingBaseOnBalls} />
        <StatRow title="SV" state={saves} action={setSaves} />
        <StatRow title="BS" state={blownSaves} action={setBlownSaves} />
        <StatRow title="W" state={win} action={setWin} />
        <StatRow title="L" state={loss} action={setLoss} />

        <FontText bold style={styles.categoryText}>Fielding</FontText>

        <StatRow title="Error" state={error} action={setError} />


        <FontText bold style={styles.categoryText}>Game Info</FontText>
    
        <StatRow title="Captain?" type="switch" state={isCaptain} action={setIsCaptain} />
        {isCaptain &&
          <StatRow title="Did you win?" type="switch" state={isGameWon} action={setIsGameWon} />
        }

        {isCaptain &&
          <StatRow title="Opponent" type="picker" opponents={opponents} state={selectedOpponent} action={setSelectedOpponent} />
        }
        
        {isCaptain &&
          <StatRow title="Win Score" state={winnerScore} action={setWinnerScore} />
        }
        {isCaptain &&
          <StatRow title="Loss Score" state={loserScore} action={setLoserScore} />
        }
        {isCaptain &&
          <StatRow title="Tot. Innings" state={totalInnings} action={setTotalInnings} />
        }

        <View style={{width: '90%'}}>
          <Button
            loading={isLoading}
            mode='contained'
            color={colors.submitButton}
            onPress={() => submitConfirmation()}
            style={{ marginTop: 40, marginBottom: 20, borderRadius: 25 }}
            contentStyle={{ height: 50 }}
          >
            <FontText bold>{isLoading ? 'Loading' : 'Submit'}</FontText>
          </Button>
        </View>
      </View>
    </Header>
  )
}

const styles = StyleSheet.create({
  categoryText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: wp('5%'),
    marginTop: 30
  },
  button: {
    width:'90%', 
    marginTop: 40, 
    marginBottom: 20
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    width: wp('95%')
  },
})

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser,
})

export default connect(mapStateToProps)(Form)