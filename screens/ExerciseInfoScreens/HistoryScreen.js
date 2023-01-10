import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import HelperFunctions from "../../classes/HelperFunctions";

export default function HistoryScreen({route, navigation}) {

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
      <View style={styles.card}>
        <Text style={styles.workoutName}>{item.workout.name}</Text>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={styles.workoutDate}>{dayOfTheWeek}, {day} {month} {year}</Text>
          <Text style={styles.workoutDate}>{time}</Text>
        </View>
        
        {
          item.workout.notes !== ''? 
            <Text style={styles.workoutNotes}><FontAwesomeIcon icon="fa-regular fa-note-sticky"/> {item.workout.notes}</Text>
            : null
        }
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={styles.workoutHeading}>Sets Performed</Text>
          <Text style={styles.workoutHeading}>1RM</Text>
        </View>
        
        {
          item.workout.workoutExercises.map((val, i) => {
            return val.sets.map((weightsAndReps, j) => {
              return (
                <View style={{
                  display: 'flex',
                  flexDirection: 'row'
                }} key={j}>
                  <Text style={[styles.workoutExerciseText, {flex: 1, textAlign: 'left', fontWeight: 'bold'}]}>
                    {j + 1}
                  </Text>
                  <Text style={[styles.workoutExerciseText, {flex: 6}]}>
                    {weightsAndReps.weight} kg × {weightsAndReps.reps}
                  </Text>
                  <Text style={[styles.workoutExerciseText, {flex: 6, textAlign: 'right'}]}>
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
    <View style={styles.container}>
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
  }
});