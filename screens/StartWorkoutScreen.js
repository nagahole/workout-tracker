import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect } from "react";
import { Button, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useSelector, useDispatch } from "react-redux";
import WorkoutTemplate from "../classes/WorkoutTemplate";
import { WorkoutTemplates } from "../data/WorkoutTemplates";
import { addTemplate, addWorkout, setTemplates, setWorkouts } from "../redux/actions";
import structuredClone from 'realistic-structured-clone';
import HelperFunctions from "../classes/HelperFunctions";

export default function StartWorkoutScreen({route, navigation}) {

  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  const templates = useSelector(state => state.templates);
  const workouts = useSelector(state => state.workouts);

  const isLightMode = HelperFunctions.isLightMode();

  function startWorkout(template = new WorkoutTemplate("New Workout", [])) {
    navigation.navigate("Workout", { 
      startTime: Date.now(),
      template: template,
      finishWorkout: workout => { finishWorkout(workout); },
      mode: 'workout',
    })
  }

  function makeTemplate(template = new WorkoutTemplate("New Template", [])) {
    navigation.navigate("Workout", {
      mode: 'template',
      template: template,
      finishWorkout: workout =>{ finishTemplate(workout); }
    });
  }


  function editTemplate(template, index) {
    navigation.navigate("Workout", {
      mode: 'editTemplate',
      template: template,
      finishWorkout: workout => { finishEditTemplate(workout, index) },
      deleteTemplate: () => {
        let _templates = structuredClone(templates);
        _templates.splice(index, 1);
        dispatch(setTemplates(_templates));
        navigation.goBack();
      }
    });
  }

  function sortWorkoutsByDate() {
    let _workouts = structuredClone(workouts)
    _workouts = HelperFunctions.getWorkoutsSortedByDate(_workouts);
    dispatch(setWorkouts(_workouts));
  }

  function finishWorkout(workout) {
    dispatch(addWorkout(workout));
  }

  function finishTemplate(workout) {
    let workoutTemplate = new WorkoutTemplate(workout.name, workout.workoutExercises);

    dispatch(addTemplate(workoutTemplate));
  }

  function finishEditTemplate(workout, index) {
    let workoutTemplate = new WorkoutTemplate(workout.name, workout.workoutExercises);
    let _templates = structuredClone(templates);
    _templates[index] = workoutTemplate
    dispatch(setTemplates(_templates));
  }

  useEffect(() => {
    sortWorkoutsByDate()
  }, []);

  function renderTemplate(wt, i, editable = false) {
    return (
      <TouchableOpacity style={isLightMode? styles.card_light : styles.card_dark} key={i} onPress={() => { startWorkout(wt) }}>
        <View style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={[isLightMode? styles.h3_light : styles.h3_dark, {marginBottom: 8}]}>{wt.name}</Text>
          {
            !editable? null :
            <TouchableOpacity onPress={() => { editTemplate(wt, i) }}>
              <FontAwesomeIcon icon="fa-regular fa-pen-to-square" size={20} color={isLightMode? 'black' : 'white'}/>
            </TouchableOpacity>
          }
        </View>
        {
          wt.workoutExercises.map((we, j) => {

            return (
              <Text key={j} style={{
                fontSize: 15,
                marginBottom: 3,
                color: isLightMode? '#515151' : '#aaa'
              }}>{we.sets.length} × {we.exercise.name}</Text>
            )
          })
        }
      </TouchableOpacity>
    )
  }

  return (
    <View style={[{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }, isLightMode? null : { backgroundColor: '#202020' }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollviewContainer}
      >
        <Text style={isLightMode? styles.h1_light : styles.h1_dark}>Start Workout</Text>
        <Text style={isLightMode? styles.h3_light : styles.h3_dark}>Quick Start</Text>
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => { startWorkout() }}
        >
          <Text style={styles.startWorkoutText}>Start an Empty Workout</Text>
        </TouchableOpacity>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text style={isLightMode? styles.h2_light : styles.h2_dark}>Templates</Text>
          <TouchableOpacity 
            style={{
              backgroundColor: '#58A5F855',
              padding: 5,
              paddingHorizontal: 10,
              marginTop: -17,
              borderRadius: 5
            }}
            onPress={() => {makeTemplate()} }
          >
            <FontAwesomeIcon color="#58A5F8" size={16} icon="fa-solid fa-plus" />
          </TouchableOpacity>
        </View>
        
        <Text style={isLightMode? styles.h3_light : styles.h3_dark}>My Templates</Text>
        {
          templates.map((wt,i) => renderTemplate(wt, i, true))
        }
        <Text style={isLightMode? styles.h3_light : styles.h3_dark}>Example Templates</Text>
        {
          WorkoutTemplates.map((wt, i) => renderTemplate(wt, i))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20
  },

  card_light: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 15,
    width: '100%',
    marginBottom: 15,
    borderRadius: 15
  },

  card_dark: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: 15,
    width: '100%',
    marginBottom: 15,
    borderRadius: 15
  },

  startWorkoutText: {
    textAlign: 'center',
    color: "white",
    fontSize: 16,
    fontWeight: 'bold'
  },  

  startWorkoutButton: {
    width: '100%',
    backgroundColor: "#58A5F8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
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
    color: 'white',
  },

  h2_dark: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold',
    color: 'white',
  },

  h3_dark: {
    fontSize: 16,
    marginBottom: 18,
    fontWeight: 'bold',
    color: 'white',
  }
});