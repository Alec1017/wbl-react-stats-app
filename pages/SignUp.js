import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInput, IconButton, Button, Drawer, Checkbox } from 'react-native-paper'
import { ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'

import Container from '../components/Container'
import FontText from '../utils/FontText'
import { loginCurrentUser } from '../actions/currentUserActions'
import { colors } from '../theme/colors'
import { BACKEND_API } from 'react-native-dotenv'


const SignUp = props => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [team, setTeam] = useState(null)
  const [captain, setCaptain] = useState(false)
  const [allTeams, setAllTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeams() {
      try {
        const teamsResponse = await fetch(BACKEND_API + '/api/teams');
        let teamsData = await teamsResponse.json()
    
        setAllTeams(teamsData)
        setLoading(false);
      } catch(error) {
        console.log(error)
      }
    }

    fetchTeams()
  }, [])

  async function handleSignUp() {
    setIsLoading(true)

    try {
      if (firstName == '') {
        throw "First name can't be empty"
      }

      if (lastName == '') {
        throw "Last name can't be emtpy"
      }

      if (typeof team !== 'number') {
        throw "Please select a team"
      }

      // Register new user
      const registerResponse = await fetch(BACKEND_API + '/auth/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, 
                              password: password,
                              first_name: firstName,
                              last_name: lastName,
                              team: team,
                              captain: captain
                            })
      });
      const registerData = await registerResponse.json();

      if (!registerData.success) {
        throw registerData.message
      }

      // Use authentication token to access user data
      const userDataResponse = await fetch(BACKEND_API + '/auth/user_status', {
        headers: {
          'Authorization': `Basic ${registerData.token}`
        }
      });
      const userData = await userDataResponse.json()

      if (userData.success) {
        const user = {
          uid: userData.data.player_id,
          firstName: userData.data.first_name,
          lastName: userData.data.last_name,
          email: userData.data.email,
          isAdmin: userData.data.admin,
          subscribed: userData.data.subscribed,
          team: userData.data.team,
          token: registerData.token,
          captain: registerData.captain
        }

        setIsLoading(false)
        props.loginCurrentUser(user)
        props.navigation.navigate('Form')
      } else {
        throw "Sign up failed, please try again"
      }

    } catch (e) {
      setIsLoading(false);

      let errorMessage = e.toString()
      if (errorMessage.split(" ")[0] == 'Error:') {
        errorMessage = errorMessage.split(" ")
        errorMessage.shift()
        errorMessage = errorMessage.join(' ')
      }

      showMessage({
        message: "\nError",
        description: errorMessage,
        type: "danger",
        style: {height: '20%', width: '70%'},
        titleStyle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
        textStyle: {textAlign: 'center'},
        duration: 2000
      })
    }
  }
  
  return (
    <Container>
      <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: hp('4%'), position: 'absolute', top: 0}}>
        <IconButton icon="arrow-left" color={colors.iconButton} size={35} onPress={() => props.navigation.goBack()} />
      </View>
      
      <FontText bold style={styles.title}>Sign Up</FontText>

      <KeyboardAwareScrollView style={{ width: '80%'}} showsVerticalScrollIndicator={false}>
        <TextInput 
          label='First Name'
          placeholder='John'
          onChangeText={firstName => setFirstName(firstName)}
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 30, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <TextInput 
          label='Last Name'
          placeholder='Smith'
          onChangeText={lastName => setLastName(lastName)}
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 20, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <TextInput 
          label='Email Address'
          placeholder='email@address.com'
          onChangeText={email => setEmail(email)}
          keyboardType='email-address'
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 20, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <TextInput 
          label='Password'
          placeholder='password'
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
          selectionColor={colors.formSelection}
          underlineColor={colors.formDetail}
          style={{ marginTop: 20, height: hp('8%') }}
          theme={{ colors: { primary: colors.formSelection } }}
        />

        <View style={{marginTop: 20}}>
          <FontText style={styles.teamText}>Select Your Team</FontText>

          <Drawer.Section style={{marginTop: 20}}>
            {!loading && allTeams.map((t, i) => {
              return(
                <Drawer.Item
                  key={i}
                  label={t.name}
                  active={team === t.id}
                  onPress={() => setTeam(t.id)}
                  theme= {{colors : {primary: colors.activityIndicator}}}
                />
              )
            })}

            {loading &&
              <ActivityIndicator  animating={true} size="small" color={colors.activityIndicator} />
            }
          </Drawer.Section>

          <Drawer.Section style={{marginTop: 20}}>
            <FontText style={styles.captainText}>Are you a captain?</FontText>

            <Drawer.Item
              key={1}
              label='Yes'
              active={captain === true}
              onPress={() => setCaptain(true)}
              theme= {{colors : {primary: colors.activityIndicator}}}
            />

            <Drawer.Item
              key={2}
              label='No'
              active={captain === false}
              onPress={() => setCaptain(false)}
              theme= {{colors : {primary: colors.activityIndicator}}}
            />
          </Drawer.Section>
        </View>

        <Button
          loading={isLoading}
          mode='contained'
          color={colors.submitButton}
          onPress={() => handleSignUp()}
          style={{ marginTop: 20, borderRadius: 25, marginBottom: 20}}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: 'bold'}}
        >
          <FontText bold>{isLoading ? 'Loading' : 'Sign Up'}</FontText>
        </Button>
 
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: hp('12%'),
  },
  teamText: {
    fontSize: 20,
    alignSelf: 'center',
  },
  captainText: {
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 20
  },
})

const mapStateToProps = state => ({
  currentUser: state.currentUser.currentUser
})

const mapDispatchToProps = dispatch => ({
  loginCurrentUser: userData => dispatch(loginCurrentUser(userData))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)