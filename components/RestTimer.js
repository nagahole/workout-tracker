import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"
import HelperFunctions from "../classes/HelperFunctions";

export default function RestTimer(props) {

  const insets = useSafeAreaInsets();

  const isLightMode = HelperFunctions.isLightMode();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => { props.closeModal() }}>
        <View style={{
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(0,0,0,0.6)',
          position: 'absolute'
        }}></View>
      </TouchableWithoutFeedback>
      <View style={[isLightMode? styles.card_light : styles.card_dark, {
        marginTop: insets.top + 10,
        marginLeft: insets.left,
        marginRight: insets.right,
        marginBottom: insets.bottom
      }]}>
        <View style={styles.headerContainer}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={isLightMode? styles.xmarkButton_light : styles.xmarkButton_dark} onPress={props.closeModal}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" size={20} color={isLightMode? "black" : "white"}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={isLightMode? styles.title_light : styles.title_dark}>Rest Timer</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}></View>
        </View>
        
        <View style={{height: 20}}>
          {
            props.restTimerRunning? null :
              <Text style={isLightMode? styles.descriptionText_light : styles.descriptionText_dark}>Choose a duration below</Text>
          }
        </View>

        <View style={{width: '100%', alignItems: 'center', marginVertical: 30}}>
          <CountdownCircleTimer
            isPlaying={props.restTimerRunning}
            duration={props.restCountdown <= 0? 0 : props.restDuration}
            initialRemainingTime={props.restCountdown}
            colors={['#58A5F8']}
            strokeWidth={8}
            size={300}
          >
            {({remainingTime}) => {
              if (!props.restTimerRunning)
                return (
                  <View>
                    <TouchableOpacity style={isLightMode? styles.timeButton_light : styles.timeButton_dark} onPress={() => { props.startRestTimer(60) }}>
                    <Text style={isLightMode? styles.timePresetText_light : styles.timePresetText_dark}>1:00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={isLightMode? styles.timeButton_light : styles.timeButton_dark} onPress={() => { props.startRestTimer(120) }}>
                      <Text style={isLightMode? styles.timePresetText_light : styles.timePresetText_dark}>2:00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={isLightMode? styles.timeButton_light : styles.timeButton_dark} onPress={() => { props.startRestTimer(180) }}>
                      <Text style={isLightMode? styles.timePresetText_light : styles.timePresetText_dark}>3:00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={isLightMode? styles.timeButton_light : styles.timeButton_dark} onPress={() => { props.startRestTimer(240) }}>
                      <Text style={isLightMode? styles.timePresetText_light : styles.timePresetText_dark}>4:00</Text>
                    </TouchableOpacity>
                  </View>
                )
              else
                return (
                  <View>
                    <Text style={isLightMode? styles.remainingTime_light : styles.remainingTime_dark}>{props.formatSeconds(remainingTime)}</Text>
                    <Text style={isLightMode? styles.restDuration_light : styles.restDuration_dark}>{props.formatSeconds(props.restDuration)}</Text>
                  </View>
                )
              }}
          </CountdownCircleTimer>
        </View>

        <View style={{height: 70}}>
        {
          props.restTimerRunning?
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              height: 50,
              width: '100%'
            }}>
              <View style={{flex: 1,}}>
                <TouchableOpacity style={isLightMode? styles.changeTimeButton_light : styles.changeTimeButton_dark} onPress={() => { props.incrementRestTimer(-10) }}>
                  <Text style={[{fontSize: 16, fontWeight: 'bold'}, isLightMode? null : {color: "#aaa"}]}>-10</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1,}}>
                <TouchableOpacity style={isLightMode? styles.changeTimeButton_light : styles.changeTimeButton_dark} onPress={() => { props.incrementRestTimer(10) }}>
                  <Text style={[{fontSize: 16, fontWeight: 'bold'}, isLightMode? null : {color: "#aaa"}]}>+10</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1,}}>
                <TouchableOpacity style={styles.skipButton} onPress={() => { props.skipRestTimer() }}>
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          : null
        }
        </View>
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  headerContainer: {
    display: 'flex',
    flexDirection: 'row'
  },

  xmarkButton_light: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 4,
    borderRadius: 8
  },

  xmarkButton_dark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 8,
  },

  title_light: {
    fontWeight: 'bold',
    fontSize: 16
  },

  title_dark: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },

  timePresetText_light: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },

  timePresetText_dark: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },

  timeButton_light: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 5,
    marginBottom: 5,
    borderRadius: 10
  },

  timeButton_dark: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    padding: 5,
    marginBottom: 5,
    borderRadius: 10
  },

  remainingTime_light: {
    textAlign: 'center',
    fontSize: 64,
    marginTop: -10,
    fontVariant: ['tabular-nums']
  },

  remainingTime_dark: {
    textAlign: 'center',
    fontSize: 64,
    marginTop: -10,
    fontVariant: ['tabular-nums'],
    color: 'white'
  },

  restDuration_light: {
    textAlign: 'center',
    fontSize: 28,
    color: '#919191',
    fontVariant: ['tabular-nums']
  },

  restDuration_dark: {
    textAlign: 'center',
    fontSize: 28,
    color: '#aaa',
    fontVariant: ['tabular-nums']
  },

  descriptionText_light: {
    textAlign: 'center'
  },

  descriptionText_dark: {
    textAlign: 'center',
    color: 'white'
  },

  card_light: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    width: '90%'
  },

  card_dark: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 20,
    width: '90%'
  },

  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  changeTimeButton_light: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8
  },

  changeTimeButton_dark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8
  },

  skipButton: {
    backgroundColor: '#58A5F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8
  }
});