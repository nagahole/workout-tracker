import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import HelperFunctions from "../classes/HelperFunctions";

export default function WorkoutInfo(props) {

  let workout = props.workout;

  let date = new Date(workout.date);
  let dayOfTheWeek = date.getDayOfTheWeek();
  let day = date.getDate();
  let month = date.getMonthShortened();
  let year = date.getFullYear();
  let time = date.getAMPMTime();

  const insets = useSafeAreaInsets();

  const DATA = workout.workoutExercises.map((val, i) => ({
    workoutExercise: val,
    index: i,
    id: i
  }));

  function renderItem({item}) {
    let workoutExercise = item.workoutExercise;

    return (
      <View style={{
        marginBottom: 10,
      }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6
          }}
        >
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16
          }}>{workoutExercise.exercise.name.truncate(30)}</Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16
          }}>1RM</Text>
        </View>
        {
          workoutExercise.sets.map((weightAndReps, i) => {
            return (
              <View 
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  height: 24,
                  alignItems: 'center',
                }}  
              >
                <Text style={[{flex: 1}, styles.setsText]}>{i + 1}</Text>
                <Text style={[{flex: 6}, styles.setsText]}>{weightAndReps.weight} kg × {weightAndReps.reps}</Text>
                <Text style={[{flex: 4, textAlign: 'right'}, styles.setsText]}>{Math.round(HelperFunctions.calculateOneRepMax(weightAndReps))}</Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <TouchableWithoutFeedback onPress={() => { props.closeModal() }}>
        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(0,0,0,0.6)',
          position: 'absolute'
        }}></View>
      </TouchableWithoutFeedback>
      <View style={[styles.workoutInfoCard, {
      }]}>
        <View style={styles.headerContainer}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.xmarkButton} onPress={ () => { props.closeModal() }}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" size={20}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.title}>{workout.name}</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {
              (props.editWorkout != undefined && props.editWorkout != null)?
                <TouchableOpacity style={styles.editButton} onPress={ () => { props.editWorkout(); props.closeModal() }}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity> 
              : null
            }
          </View>
        </View>
        <View style={{
          paddingHorizontal: 15
        }}>
          <Text style={styles.workoutDate}>{time} {dayOfTheWeek}, {day} {month} {year}</Text>
        </View>

        <FlatList
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={{
            maxHeight: Dimensions.get('window').height - (insets.top + 10) - 140
          }}
          contentContainerStyle={{
            padding: 15
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  workoutInfoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%'
  },

  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16
  },

  xmarkButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 2,
    borderRadius: 8
  },

  workoutDate: {
    color: '#515151',
    fontSize: 16,
    marginBottom: 15
  },

  editButton: {
    backgroundColor: "#58A5F8",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: -30,
  },

  editText: {
    fontWeight: 'bold',
    color: 'white'
  },

  setsText: {
    fontSize: 16,
    color: "#313131",
  }
});