import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

export default function WorkoutsPerWeek(props) {

  const workouts = useSelector(state => state.workouts);

  function getPreviousMonday() {
    let date = new Date();
    let day = date.getDay();
    let prevMonday = new Date();

    if(date.getDay() == 0) {
        prevMonday.setDate(date.getDate() - 7);
    } else {
        prevMonday.setDate(date.getDate() - (day-1));
    }

    prevMonday.setHours(0);
    prevMonday.setMinutes(0);
    prevMonday.setSeconds(0);
    prevMonday.setMilliseconds(0);
    return prevMonday;
  }

  let prevMonday = getPreviousMonday();

  let mondays = [];

  const weeksToDisplay = 6;

  for(let i = 0; i < weeksToDisplay; i++) {
    let date = new Date();

    date.setDate(prevMonday.getDate() - (i * 7));
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    mondays.unshift(date);
  }

  let workoutsPerWeek = [];

  let datesOfWorkouts = workouts.map(workout => new Date(workout.date)).filter(date => date >= mondays[0]);

  for(let i = 0; i < weeksToDisplay; i++) {
    let minDate = mondays[i];
    let maxDate = (i === weeksToDisplay - 1)? new Date() : mondays[i + 1];

    //Very unoptimised. Hopefully it doesn't matter

    workoutsPerWeek.push(datesOfWorkouts.filter(date => date >= minDate && date <= maxDate).length);
  }

  let data = workoutsPerWeek.map((val, i) => ({x: mondays[i], y: workoutsPerWeek[i]}) );

  return (
    <TouchableOpacity disabled={true} style={styles.card}>
      <Text style={styles.h3}>Workouts Per Week</Text>
      <Text style={{color: '#515151', fontSize: 16}}>Activity</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{x: 20}}
        height={200}
        width={Dimensions.get('window').width - 85}
        padding={{
          left: 30,
          bottom: 30,
          top: 22
        }}
      >
        <VictoryAxis
          style={{
            grid: { stroke: "transparent" },
            tickLabels: {
              letterSpacing: "1px",
            }
          }}
          tickFormat={tick => {
            let date = new Date(tick);

            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
          tickValues={mondays}
        />
        <VictoryBar
          style={{ data: { fill: "#58A5F8" } }}
          data={data}
        />
        <VictoryAxis 
          tickCount={2} 
          dependentAxis
          tickFormat={ tick => Math.round(tick) }
          style={{
            grid: { stroke: "lightgrey" },
            tickLabels: {
              fontSize: 14
            }
          }}
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