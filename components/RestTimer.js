import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"

export default function RestTimer(props) {

  const insets = useSafeAreaInsets();

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
      <View style={[styles.card, {
        marginTop: insets.top + 10,
        marginLeft: insets.left,
        marginRight: insets.right,
        marginBottom: insets.bottom
      }]}>
        <View style={styles.headerContainer}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.xmarkButton} onPress={props.closeModal}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" size={20}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.title}>Rest Timer</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

          </View>
        </View>
        
        <View style={{height: 20}}>
          {
            props.restTimerRunning? null :
              <Text style={styles.descriptionText}>Choose a duration below</Text>
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
                    <TouchableOpacity style={styles.timeButton} onPress={() => { props.startRestTimer(60) }}>
                    <Text style={styles.timePresetText}>1:00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timeButton} onPress={() => { props.startRestTimer(120) }}>
                      <Text style={styles.timePresetText}>2:00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timeButton} onPress={() => { props.startRestTimer(180) }}>
                      <Text style={styles.timePresetText}>3:00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timeButton} onPress={() => { props.startRestTimer(240) }}>
                      <Text style={styles.timePresetText}>4:00</Text>
                    </TouchableOpacity>
                  </View>
                )
              else
                return (
                  <View>
                    <Text style={styles.remainingTime}>{props.formatSeconds(remainingTime)}</Text>
                    <Text style={styles.restDuration}>{props.formatSeconds(props.restDuration)}</Text>
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
                <TouchableOpacity style={styles.changeTimeButton} onPress={() => { props.incrementRestTimer(-10) }}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>-10</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1,}}>
                <TouchableOpacity style={styles.changeTimeButton} onPress={() => { props.incrementRestTimer(10) }}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>+10</Text>
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

  xmarkButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 2,
    borderRadius: 8
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16
  },

  timePresetText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },

  timeButton: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 5,
    marginBottom: 5,
    borderRadius: 10
  },

  remainingTime: {
    textAlign: 'center',
    fontSize: 64,
    marginTop: -10,
    fontVariant: ['tabular-nums']
  },

  restDuration: {
    textAlign: 'center',
    fontSize: 28,
    color: '#919191',
    fontVariant: ['tabular-nums']
  },

  descriptionText: {
    textAlign: 'center'
  },

  card: {
    backgroundColor: 'white',
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

  changeTimeButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
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