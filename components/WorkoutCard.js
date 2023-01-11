import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HelperFunctions from "../classes/HelperFunctions";

export default function WorkoutCard(props) {
  let isLightMode = () => HelperFunctions.isLightMode();

  let workout = props.workout;

  let date = new Date(workout.date);
  let dayOfTheWeek = date.getDayOfTheWeek();
  let day = date.getDate();
  let month = date.getMonthShortened();
  let year = date.getFullYear();
  let time = date.getAMPMTime();

  year = year === new Date(Date.now()).getFullYear()? '' : year.toString() + ' ';

  return (
    <TouchableOpacity disabled={props.onPress === null? true : false} style={isLightMode()? styles.card_light : styles.card_dark} onPress={() => { props.onPress() }}>
      <Text style={isLightMode()? styles.workoutName_light : styles.workoutName_dark}>{workout.name}</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Text style={isLightMode()? styles.workoutDate_light : styles.workoutDate_dark}>{dayOfTheWeek}, {day} {month} {year}</Text>
        <Text style={isLightMode()? styles.workoutDate_light : styles.workoutDate_dark}>{time}</Text>
      </View>
      
      {
        workout.notes !== ''? 
          <Text style={isLightMode()? styles.workoutNotes_light : styles.workoutNotes_light}><FontAwesomeIcon icon="fa-regular fa-note-sticky"/> {item.workout.notes}</Text>
          : null
      }
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Text style={isLightMode()? styles.workoutHeading_light : styles.workoutHeading_dark}>Exercise</Text>
        <Text style={isLightMode()? styles.workoutHeading_light : styles.workoutHeading_dark}>Best Set</Text>
      </View>
      
      {
        workout.workoutExercises.map((val, i, arr) => {

          let bestSet = val.sets[0];

          let string = (val.sets.length.toString() + ' × ' + val.exercise.name.toString()).truncate(30);

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
              <Text style={isLightMode()? styles.workoutExerciseText_light : styles.workoutExerciseText_dark}>{string}</Text>
              <Text style={isLightMode()? styles.workoutExerciseText_light : styles.workoutExerciseText_dark}>{`${bestSet.weight} kg × ${bestSet.reps}`}</Text>
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
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 15,
    marginBottom: 14
  },

  workoutName_light: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },

  workoutName_dark: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
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
    color: 'white'
  },

  workoutHeading_light: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },

  workoutHeading_dark: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
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