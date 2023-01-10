import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

export default function WorkoutsPerWeek(props) {

  const workouts = useSelector(state => state.workouts);

  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.h3}>Workouts Per Week</Text>
      <Text style={{color: '#515151', fontSize: 16}}>Activity</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
      >
        <VictoryBar
          style={{ data: { fill: "#c43a31" } }}
          data={[3,4,2,3,2]}
        />
      </VictoryChart>
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
    marginBottom: 8,
    fontWeight: 'bold'
  }
});