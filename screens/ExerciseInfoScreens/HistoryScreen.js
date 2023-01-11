import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import HelperFunctions from "../../classes/HelperFunctions";

export default function HistoryScreen({route, navigation}) {

  const isLightMode = HelperFunctions.isLightMode();

  const [workouts, ] = useState(HelperFunctions.getWorkoutsContainingExercise(route.params.exercise));

  const DATA = workouts.map((val, i) => ({
    workout: val,
    id: i
  }));

  function renderItem(item) {
    let date = new Date(item.workout.date);
    let dayOfTheWeek = date.getDayOfTheWeek();
    let day = date.getDate();
    let month = date.getMonthShortened();
    let year = date.getFullYear();
    let time = date.getAMPMTime();

    return (
      <View style={isLightMode? styles.card_light : styles.card_dark}>
        <Text style={isLightMode? styles.workoutName_light : styles.workoutName_dark}>{item.workout.name}</Text>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={isLightMode? styles.workoutDate_light : styles.workoutDate_dark}>{dayOfTheWeek}, {day} {month} {year}</Text>
          <Text style={isLightMode? styles.workoutDate_light : styles.workoutDate_dark}>{time}</Text>
        </View>
        
        {
          item.workout.notes !== ''? 
            <Text style={isLightMode? styles.workoutNotes_light : styles.workoutName_dark}><FontAwesomeIcon icon="fa-regular fa-note-sticky"/> {item.workout.notes}</Text>
            : null
        }
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={isLightMode? styles.workoutHeading_light : styles.workoutHeading_dark}>Sets Performed</Text>
          <Text style={isLightMode? styles.workoutHeading_light : styles.workoutHeading_dark}>1RM</Text>
        </View>
        
        {
          item.workout.workoutExercises.map((val, i) => {
            return val.sets.map((weightsAndReps, j) => {
              return (
                <View style={{
                  display: 'flex',
                  flexDirection: 'row'
                }} key={j}>
                  <Text style={[isLightMode? styles.workoutExerciseText_light : styles.workoutExerciseText_dark, {flex: 1, textAlign: 'left', fontWeight: 'bold'}]}>
                    {j + 1}
                  </Text>
                  <Text style={[isLightMode? styles.workoutExerciseText_light : styles.workoutExerciseText_dark, {flex: 6}]}>
                    {weightsAndReps.weight} kg × {weightsAndReps.reps}
                  </Text>
                  <Text style={[isLightMode? styles.workoutExerciseText_light : styles.workoutExerciseText_dark, {flex: 6, textAlign: 'right'}]}>
                    {Math.round(HelperFunctions.calculateOneRepMax(weightsAndReps))}
                  </Text>
                </View>
              )
            });
          })
        }
      </View>
    )
  }

  return (
    <View style={[styles.container, isLightMode? null : {backgroundColor: '#202020'} ]}>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderItem(item) }
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
  },

  card_light: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    marginBottom: 14
  },

  card_dark: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginBottom: 14
  },

  workoutName_light: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },

  workoutName_dark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },

  workoutDate_light: {
    color: '#515151',
    fontSize: 16,
    marginBottom: 10
  },

  workoutDate_dark: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10
  },

  workoutNotes_light: {
    fontSize: 15,
    marginBottom: 10
  },

  workoutNotes_dark: {
    fontSize: 15,
    marginBottom: 10,
    color: 'white',
  },

  workoutHeading_light: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },

  workoutHeading_dark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },

  workoutExerciseText_light: {
    color: "#4f4f4f",
    fontSize: 16,
    marginBottom: 3
  },

  workoutExerciseText_dark: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 3
  },
});