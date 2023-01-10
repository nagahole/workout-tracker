import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import HelperFunctions from "../classes/HelperFunctions";
import { Exercises } from "../data/Exercises";
import Constants from "expo-constants";

export default function ExerciseSelectScreen({route, navigation}) {

  const [ searchText, setSearchText ] = useState("");

  let dict = HelperFunctions.getExercisesSortedAlphabetically(searchText);

  function onExerciseSelected(exercise) {
    route.params.onExerciseSelected(exercise);

    if (route.params?.goToExerciseInfo?? false) {
      navigation.navigate("Exercise Info", { exercise: exercise })
      return;
    }

    if (route.params.navigateTo === '_NONE')
      return;

    if (route.params.navigateTo === '_PREVIOUSSCREEN') {
      navigation.goBack();
      return;
    }
      
    navigation.navigate(route.params.navigateTo);
  }

  return (
    <View style={[{flex: 1}, route.params.accountForStatusBarHeight? { paddingTop: Constants.statusBarHeight } : null ]}>
      <FlatList 
        keyExtractor={item => item.key} 
        ListHeaderComponent={
          <View>
            <TextInput 
              placeholder="Search for an exercise"
              style={styles.searchBar}
              onChangeText={text => { setSearchText(text) }}
            />
          </View>
        }
        data={Object.keys(dict).map((key, index) => {
          return {
            key: key,
            index: index
          }
        })}
        renderItem={({ item }) => {
          let key = item.key;
          return (
            <View key={key}>
              <Text style={styles.alphabet}>{key}</Text>
              {
                dict[key].map((exercise, i, arr) => {
                  return (
                    <TouchableOpacity style={styles.exerciseContainer} key={exercise.id} onPress={() => { onExerciseSelected(exercise) }}>
                      <Text style={styles.exerciseText}>{exercise.name}</Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBar: {
    backgroundColor: "rgba(0,0,0,0.07)",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    color: "#818181"
  },

  alphabet: {
    fontSize: 16,
    padding: 15,
    paddingLeft: 20,
    paddingTop: 30,
    color: "#919191"
  },

  exerciseText: {
    fontSize: 19,
    color: "#515151"
  },

  exerciseContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#eaeaea"
  }
})