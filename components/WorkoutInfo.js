import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import HelperFunctions from "../classes/HelperFunctions";

export default function WorkoutInfo(props) {

  const isLightMode = HelperFunctions.isLightMode();

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
            fontSize: 16,
            color: isLightMode? 'black' : 'white',
          }}>{workoutExercise.exercise.name.truncate(30)}</Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: isLightMode? 'black' : 'white',
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
                <Text style={[{flex: 1}, isLightMode? styles.setsText_light : styles.setsText_dark]}>{i + 1}</Text>
                <Text style={[{flex: 6}, isLightMode? styles.setsText_light : styles.setsText_dark]}>{weightAndReps.weight} kg × {weightAndReps.reps}</Text>
                <Text style={[{flex: 4, textAlign: 'right'}, isLightMode? styles.setsText_light : styles.setsText_dark]}>{Math.round(HelperFunctions.calculateOneRepMax(weightAndReps))}</Text>
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
      <View style={[isLightMode? styles.workoutInfoCard_light : styles.workoutInfoCard_dark, {
      }]}>
        <View style={styles.headerContainer}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={isLightMode? styles.xmarkButton_light : styles.xmarkButton_dark} onPress={ () => { props.closeModal() }}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" size={20} color={isLightMode? "black" : "white"}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={isLightMode? styles.title_light : styles.title_dark}>{workout.name}</Text>
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
          <Text style={isLightMode? styles.workoutDate_light : styles.workoutDate_dark}>{time} {dayOfTheWeek}, {day} {month} {year}</Text>
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
  workoutInfoCard_light: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%'
  },

  workoutInfoCard_dark: {
    backgroundColor: '#202020',//'#2B3135',
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

  title_light: {
    fontWeight: 'bold',
    fontSize: 16
  },

  title_dark: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },  

  xmarkButton_light: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 4,
    borderRadius: 8
  },

  xmarkButton_dark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 8
  },

  workoutDate_light: {
    color: '#515151',
    fontSize: 16,
    marginBottom: 15
  },

  workoutDate_dark: {
    color: '#aaa',
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

  setsText_light: {
    fontSize: 16,
    color: "#313131",
  },

  setsText_dark: {
    fontSize: 16,
    color: "#aaa",
  }
});