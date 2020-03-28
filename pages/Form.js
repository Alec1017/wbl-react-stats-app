import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import LottieView from 'lottie-react-native';

import Container from '../components/Container';
import StatRow from '../components/StatRow';
import { db } from '../Firebase';


export default function Form(props) {
  console.log(props);
  const [singles, setSingles] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [triples, setTriples] = useState(0);
  const [homeRuns, setHomeRuns] = useState(0);
  const [hitByPitch, setHitByPitch] = useState(0);
  const [baseOnBalls, setBaseOnBalls] = useState(0);
  const [runsBattedIn, setRunsBattedIn] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [stolenBases, setStolenBases] = useState(0);
  const [caughtStealing, setCaughtStealing] = useState(0);
  const [outs, setOuts] = useState(0);

  const [inningsPitched, setInningsPitched] = useState(0);
  const [earnedRuns, setEarnedRuns] = useState(0);
  const [runs, setRuns] = useState(0);
  const [pitchingStrikeouts, setPitchingStrikeouts] = useState(0);
  const [pitchingBaseOnBalls, setPitchingBaseOnBalls] = useState(0);
  const [saves, setSaves] = useState(0);
  const [blownSaves, setBlownSaves] = useState(0);
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
    
    await db.collection('games').add({
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
      caughtStealing,
      outs,
      inningsPitched,
      earnedRuns,
      runs,
      pitchingStrikeouts,
      pitchingBaseOnBalls,
      saves,
      blownSaves,
      win,
      loss,
      error,
      isCaptain,
      isGameWon,
      winnerScore,
      loserScore,
      selectedOpponent,
      isAggregated: false
    });


    setIsLoading(false);
    resetState();

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
    );

    showMessage({
      message: "\nStats submitted",
      description: animation,
      type: "success",
      style: {height: '20%', width: '70%'},
      titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
      textStyle: {alignSelf: 'center', justifyContent: 'center'},
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
    setCaughtStealing(0);
    setOuts(0);

    setInningsPitched(0);
    setEarnedRuns(0);
    setRuns(0);
    setPitchingStrikeouts(0);
    setPitchingBaseOnBalls(0);
    setSaves(0);
    setBlownSaves(0);
    setWin(0);
    setLoss(0);

    setError(0);
    
    setIsCaptain(false);
    setIsGameWon(false);
    setWinnerScore(0);
    setLoserScore(0);
    setSelectedOpponent(opponents[0]);
  }

  function renderNavBar() {
    return (
      <View style={{marginTop: hp('4.5%'), alignSelf: 'center'}}>
          <Text style={{fontWeight: 'bold', color: '#ffffff', fontSize: 21}}>Enter your stats</Text>
      </View>
    )
  }

  function renderContent() {
    return (
      <Container containerType="scroll">
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
        <StatRow title="CS" state={caughtStealing} action={setCaughtStealing} />

        <Text style={styles.categoryText}>Pitching</Text>

        <StatRow title="IP" numberType="fractions" state={inningsPitched} action={setInningsPitched} />
        <StatRow title="ER" state={earnedRuns} action={setEarnedRuns} />
        <StatRow title="R" state={runs} action={setRuns} />
        <StatRow title="K" state={pitchingStrikeouts} action={setPitchingStrikeouts} />
        <StatRow title="BB" state={pitchingBaseOnBalls} action={setPitchingBaseOnBalls} />
        <StatRow title="SV" state={saves} action={setSaves} />
        <StatRow title="BS" state={blownSaves} action={setBlownSaves} />
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

        <View style={{width: '90%'}}>
          <Button
            loading={isLoading}
            mode='contained'
            color='#007bff'
            onPress={() => submitConfirmation()}
            style={{ marginTop: 40, marginBottom: 20 }}
            contentStyle={{ height: 50 }}
            labelStyle={{ fontWeight: 'bold'}}
          >
            {isLoading ? 'Loading' : 'Submit'}
          </Button>
        </View>

        {/* <Modal isVisible={isModalVisible}>
          <View style={{flex: 1, height: '20%', width: '70%'}}>
            <Text>Hello!</Text>
            <Button title="Hide modal" onPress={() => setIsModalVisible(false)} />
          </View>
        </Modal> */}


    </Container>
    );
  }

  const headerTitle = (
    <View>
      <Text style={styles.title}>Hey {props.route.params.firstName},</Text>
      <Text style={styles.title}>Enter your stats</Text>
    </View>
  )

  return (
    <ReactNativeParallaxHeader
      title={headerTitle}
      headerMaxHeight={hp('23%')}
      headerMinHeight={hp('10%')}
      alwaysShowTitle={false}
      alwaysShowNavBar={false}
      renderNavBar={renderNavBar}
      renderContent={renderContent}
    /> 
  )
}


const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold'
  },
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
  }
});