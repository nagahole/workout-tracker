import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import HelperFunctions from "../classes/HelperFunctions";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutInfo from "../components/WorkoutInfo";

export default function FinishedWorkoutScreen({route, navigation}) {

  const insets = useSafeAreaInsets();

  const workouts = useSelector(state => state.workouts);

  const [workoutInfoOpen, setWorkoutInfoOpen] = useState(false);

  const isLightMode = HelperFunctions.isLightMode();

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }, isLightMode? null : { backgroundColor: '#111' } ]}>
      <Modal
        visible={workoutInfoOpen}
        animationType='fade'
        transparent={true}
      >
        <WorkoutInfo
          closeModal={() => { setWorkoutInfoOpen(false) }}
          workout={route.params.workout}
        />
      </Modal>
      <View style={styles.headerBar}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <TouchableOpacity 
            style={isLightMode? styles.exitButtonContainer_light : styles.exitButtonContainer_dark}
            onPress={() => { navigation.pop(2) } }
          >
            <FontAwesomeIcon icon="fa-solid fa-xmark" size={18} color={isLightMode? 'black' : 'white'}/>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}></View>
      </View>
      <View style={styles.starsContainer}>
        <FontAwesomeIcon size={32} style={[styles.yellow, styles.starLeft]} icon="fa-solid fa-star"/>
        <FontAwesomeIcon size={45} style={[styles.yellow, styles.starMiddle]} icon="fa-solid fa-star"/>
        <FontAwesomeIcon size={32} style={[styles.yellow, styles.starRight]} icon="fa-solid fa-star"/>
      </View>
      
      <Text style={isLightMode? styles.title_light : styles.title_dark}>Congratulations!</Text>
      <Text style={isLightMode? styles.subheading_light : styles.subheading_dark}>You've completed your {workouts.length.nth()} workout</Text>

      <ScrollView style={{
        width: Dimensions.get('window').width,
        padding: 20,
        maxHeight: 350,
        marginVertical: 20
      }}>
        <WorkoutCard workout={route.params.workout} onPress={ () => { setWorkoutInfoOpen(true)} }/>
      </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  headerBar: {
    paddingHorizontal: 17.5,
    height: 49,
    display: 'flex',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
  },

  exitButtonContainer_light: {
    backgroundColor: "rgba(0,0,0,0.08)",
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 8,
    overflow: 'hidden',
  },

  exitButtonContainer_dark: {
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 8,
    overflow: 'hidden',
  },

  h1: {
    fontSize: 32,
    marginBottom: 25,
    fontWeight: 'bold'
  },

  h2: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold'
  },

  h3: {
    fontSize: 16,
    marginBottom: 18,
    fontWeight: 'bold'
  },

  starsContainer: {
    marginTop: 60,
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center"
  },

  yellow: {
    color: '#F1C40F'
  },

  starLeft: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    transform: [{translateY: 14}, {rotate: "45deg"}] 
  },

  starMiddle: {
    height: 50,
    width: 75,
    marginHorizontal: 5,
  },

  starRight: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    transform: [{translateY: 14}, {rotate: "-45deg"}]
  },

  title_light: {
    fontSize: 28,
    marginTop: 20,
    marginBottom: 10
  },

  title_dark: {
    color: 'white',
    fontSize: 28,
    marginTop: 20,
    marginBottom: 10
  },

  subheading_light: {
    fontWeight: '200',
    fontSize: 18
  },

  subheading_dark: {
    fontWeight: '200',
    fontSize: 18,
    color: 'white'
  }
});