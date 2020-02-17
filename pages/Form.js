import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';

import Container from '../components/Container';
import StatRow from '../components/StatRow';


export default function Form(props) {
  const [selectedPlayer, setSelectedPlayer] = useState(props.route.params.player);
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



  return (
    <Container containerType="scroll">
        <Text style={styles.welcome}> Hey {selectedPlayer}! Enter your stats</Text>

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
        

        <View style={styles.button}>
          <Button
            buttonStyle={{ height: 50}}
            titleStyle={{ fontWeight: 'bold'}}
            title="Submit"
            onPress={() => Alert.alert('Singles: ' + singles.toString()  + '\nStrikeouts: ' + strikeouts.toString() )}
          />
        </View>
    </Container>
  )
}


const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
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