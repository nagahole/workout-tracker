import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HelperFunctions from "../classes/HelperFunctions";

export default function WorkoutCard(props) {
  let workout = props.workout;

  let date = new Date(workout.date);
  let dayOfTheWeek = date.getDayOfTheWeek();
  let day = date.getDate();
  let month = date.getMonthShortened();
  let year = date.getFullYear();
  let time = date.getAMPMTime();

  year = year === new Date(Date.now()).getFullYear()? '' : year.toString() + ' ';

  return (
    <TouchableOpacity disabled={props.onPress === null? true : false} style={styles.card} onPress={() => { onPress() }}>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Text style={styles.workoutDate}>{dayOfTheWeek}, {day} {month} {year}</Text>
        <Text style={styles.workoutDate}>{time}</Text>
      </View>
      
      {
        workout.notes !== ''? 
          <Text style={styles.workoutNotes}><FontAwesomeIcon icon="fa-regular fa-note-sticky"/> {item.workout.notes}</Text>
          : null
      }
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Text style={styles.workoutHeading}>Exercise</Text>
        <Text style={styles.workoutHeading}>Best Set</Text>
      </View>
      
      {
        workout.workoutExercises.map((val, i, arr) => {

          let bestSet = val.sets[0];

          let string = (val.sets.length.toString() + ' × ' + val.exercise.name.toString()).truncate(40);

          for (let weightAndReps of val.sets) {

            if (HelperFunctions.calculateOneRepMax(weightAndReps) > HelperFunctions.calculateOneRepMax(bestSet))
              bestSet = weightAndReps
          }

          return (
            <View 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
              key={i}
            >
              <Text style={styles.workoutExerciseText}>{string}</Text>
              <Text style={styles.workoutExerciseText}>{`${bestSet.weight} kg × ${bestSet.reps}`}</Text>
            </View>
          )
        })
      }
    </TouchableOpacity>
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