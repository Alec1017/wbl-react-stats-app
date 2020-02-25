import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';

import Container from '../components/Container';
import StatRow from '../components/StatRow';
import { db } from '../Firebase';


export default function Form(props) {
  const [singles, setSingles] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [triples, setTriples] = useState(0);
  const [homeRuns, setHomeRuns] = useState(0);
  const [hitByPitch, setHitByPitch] = useState(0);
  const [baseOnBalls, setBaseOnBalls] = useState(0);
  const [runsBattedIn, setRunsBattedIn] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [stolenBases, setStolenBases] = useState(0);
  const [outs, setOuts] = useState(0);

  const [inningsPitched, setInningsPitched] = useState(0);
  const [earnedRuns, setEarnedRuns] = useState(0);
  const [runs, setRuns] = useState(0);
  const [pitchingStrikeouts, setPitchingStrikeouts] = useState(0);
  const [pitchingBaseOnBalls, setPitchingBaseOnBalls] = useState(0);
  const [saves, setSaves] = useState(0);
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);

  const [error, setError] = useState(0);

  const [player, setPlayer] = useState(props.route.params.firstName + ' ' + props.route.params.lastName);
  const [uid, setUID] = useState(props.route.params.uid);
  const [isCaptain, setIsCaptain] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [winnerScore, setWinnerScore] = useState(0);
  const [loserScore, setLoserScore] = useState(0);
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [opponents, setOpponents] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection('users').get().then(snapshot => {
      let opponents = [];
      snapshot.forEach(doc => {
        let opponent = doc.data().firstName + ' ' + doc.data().lastName;

        if (doc.data().uid != player.uid) {
          opponents.push(opponent);
        }
      });
      setSelectedOpponent(opponents[0]);
      setOpponents(opponents);
    });
  }, []);

  async function addGame() {
    setIsLoading(true);
    
    await db.collection('users').add({
      player,
      uid,
      date: new Date().toDateString(),
      singles,
      doubles,
      triples,
      homeRuns,
      hitByPitch,
      baseOnBalls,
      runsBattedIn,
      strikeouts,
      stolenBases,
      outs,
      inningsPitched,
      earnedRuns,
      runs,
      pitchingStrikeouts,
      pitchingBaseOnBalls,
      saves,
      win,
      loss,
      error,
      isCaptain,
      isGameWon,
      winnerScore,
      loserScore,
      selectedOpponent
    });

    setIsLoading(false);
    resetState();

    showMessage({
      message: "\nSuccess!",
      description: "Your stats have been submitted",
      type: "success",
      style: {height: '20%', width: '70%'},
      titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
      textStyle: {textAlign: 'center'},
      duration: 2000
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    setSingles(0);
    setDoubles(0);
    setTriples(0);
    setHomeRuns(0);
    setHitByPitch(0);
    setBaseOnBalls(0);
    setRunsBattedIn(0);
    setStrikeouts(0);
    setStolenBases(0);
    setOuts(0);

    setInningsPitched(0);
    setEarnedRuns(0);
    setRuns(0);
    setPitchingStrikeouts(0);
    setPitchingBaseOnBalls(0);
    setSaves(0);
    setWin(0);
    setLoss(0);

    setError(0);
    
    setIsCaptain(false);
    setIsGameWon(false);
    setWinnerScore(0);
    setLoserScore(0);
    setSelectedOpponent(opponents[0]);
  }

  return (
    <Container containerType="scroll">
        <View style={{alignSelf: 'flex-end', marginRight: 20, marginTop: 10}}>
          <Button type="clear" title="Settings" onPress={() => props.navigation.navigate('Settings')} />
        </View>
        <Text style={styles.welcome}>Hey {props.route.params.firstName}, Enter your stats</Text>

        <Text style={styles.categoryText}>Hitting</Text>
        
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

        <Text style={styles.categoryText}>Pitching</Text>

        <StatRow title="IP" state={inningsPitched} action={setInningsPitched} />
        <StatRow title="ER" state={earnedRuns} action={setEarnedRuns} />
        <StatRow title="R" state={runs} action={setRuns} />
        <StatRow title="K" state={pitchingStrikeouts} action={setPitchingStrikeouts} />
        <StatRow title="BB" state={pitchingBaseOnBalls} action={setPitchingBaseOnBalls} />
        <StatRow title="SV" state={saves} action={setSaves} />
        <StatRow title="W" state={win} action={setWin} />
        <StatRow title="L" state={loss} action={setLoss} />

        <Text style={styles.categoryText}>Fielding</Text>

        <StatRow title="Error" state={error} action={setError} />


        <Text style={styles.categoryText}>Game Info</Text>
    
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

        <View style={styles.button}>
          <Button
            buttonStyle={{ height: 50}}
            titleStyle={{ fontWeight: 'bold'}}
            title="Submit"
            onPress={() => submitConfirmation()}
          />
        </View>

        <Overlay 
          isVisible={isLoading}
          width="100%"
          height="100%"
          overlayBackgroundColor="rgba(0,0,0,0.1)"
        >
          <View style={{ flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </Overlay>
    </Container>
  )
}


const styles = StyleSheet.create({
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    fontWeight: 'bold'
  },
  categoryText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginTop: 30
  },
  button: {
    width:'60%', 
    marginTop: 40, 
    marginBottom: 20
  }
});