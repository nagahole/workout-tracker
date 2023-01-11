import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import WorkoutTemplate from "../classes/WorkoutTemplate";
import { setWorkouts } from "../redux/actions";
import structuredClone from 'realistic-structured-clone';
import HelperFunctions from "../classes/HelperFunctions";
import WorkoutInfo from "../components/WorkoutInfo";
import WeightAndReps from "../classes/WeightAndReps";
import WorkoutCard from "../components/WorkoutCard";

export default function HistoryScreen({navigation}) {

  const insets = useSafeAreaInsets();

  const workouts = useSelector(state => state.workouts);

  const dispatch = useDispatch();

  const [workoutInfoOpen, setWorkoutInfoOpen] = useState(false);
  const [workoutItemDisplayed, setWorkoutItemDisplayed] = useState({});

  const isLightMode = HelperFunctions.isLightMode();

  useEffect(() => {
    let _workouts = structuredClone(workouts)
  _workouts = HelperFunctions.getWorkoutsSortedByDate(_workouts);
  dispatch(setWorkouts(_workouts));
  }, [])
  

  function renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <Text style={isLightMode? styles.h1_light : styles.h1_dark}>History</Text>
      </View>
    )
  }

  function editWorkout(item) {
    let workout = item.workout;
    let template = new WorkoutTemplate(workout.name, workout.workoutExercises);

    navigation.navigate("Edit Workout", {
      mode: 'editWorkout',
      template: template,
      originalDate: item.workout.date,
      finishWorkout: workout => { 
        let _workouts = structuredClone(workouts);
        _workouts[item.index] = workout;
        dispatch(setWorkouts(_workouts));
      },
      deleteWorkout: () => {
        let _workouts = structuredClone(workouts);
        _workouts.splice(item.index, 1);
        dispatch(setWorkouts(_workouts));
      }
    });
  }

  function openWorkout(item) {
    setWorkoutItemDisplayed(item);
    setWorkoutInfoOpen(true);
  }

  function renderItem(item) {
    return <WorkoutCard workout={item.workout} onPress={() => {openWorkout(item)}}/>
  }

  const DATA = workouts.map((val, i) => {
    return {
      workout: val,
      index: i,
      id: val.date
    }
  })

  return (
    <View style={[{
      flex: 1,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }, isLightMode? null : {backgroundColor: "#111"} ]}>
      <Modal
        visible={workoutInfoOpen}
        animationType='fade'
        transparent={true}
      >
        <WorkoutInfo
          closeModal={() => { setWorkoutInfoOpen(false) }}
          workout={workoutItemDisplayed.workout}
          editWorkout={() => { editWorkout(workoutItemDisplayed) }}
        />
      </Modal>
      <FlatList
        data={DATA}
        ListHeaderComponent={ () => renderHeader() }
        renderItem={ ({item}) => renderItem(item) }
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 20}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {

  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    marginBottom: 14
  },

  workoutName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },

  workoutDate: {
    color: '#515151',
    fontSize: 16,
    marginBottom: 10
  },

  workoutNotes: {
    fontSize: 15,
    marginBottom: 10
  },

  workoutHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },

  workoutExerciseText: {
    color: "#4f4f4f",
    fontSize: 16,
    marginBottom: 3
  },

  h1_light: {
    fontSize: 32,
    marginBottom: 25,
    fontWeight: 'bold'
  },

  h2_light: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold'
  },

  h3_light: {
    fontSize: 16,
    marginBottom: 18,
    fontWeight: 'bold'
  },

  h1_dark: {
    fontSize: 32,
    marginBottom: 25,
    fontWeight: 'bold',
    color: 'white'
  },

  h2_dark: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold',
    color: 'white'
  },

  h3_dark: {
    fontSize: 16,
    marginBottom: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});