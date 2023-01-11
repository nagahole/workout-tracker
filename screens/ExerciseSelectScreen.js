import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import HelperFunctions from "../classes/HelperFunctions";
import { Exercises } from "../data/Exercises";
import Constants from "expo-constants";

export default function ExerciseSelectScreen({route, navigation}) {

  const isLightMode = HelperFunctions.isLightMode();

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
    <View style={[
      {flex: 1}, 
      route.params.accountForStatusBarHeight? { paddingTop: Constants.statusBarHeight } : null,
      isLightMode? null : {backgroundColor: '#111'}
      ]}>
      <FlatList 
        keyExtractor={item => item.key} 
        ListHeaderComponent={
          <View>
            <TextInput 
              placeholder="Search for an exercise"
              style={isLightMode? styles.searchBar_light : styles.searchBar_dark}
              onChangeText={text => { setSearchText(text) }}
              placeholderTextColor="#666"
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
              <Text style={isLightMode? styles.alphabet_light : styles.alphabet_dark}>{key}</Text>
              {
                dict[key].map((exercise, i, arr) => {
                  return (
                    <TouchableOpacity style={isLightMode? styles.exerciseContainer_light : styles.exerciseContainer_dark} key={exercise.id} onPress={() => { onExerciseSelected(exercise) }}>
                      <Text style={isLightMode? styles.exerciseText_light : styles.exerciseText_dark}>{exercise.name}</Text>
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

  searchBar_light: {
    backgroundColor: "rgba(0,0,0,0.07)",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    color: "#818181"
  },

  searchBar_dark: {
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    color: "white",
  },

  alphabet_light: {
    fontSize: 16,
    padding: 15,
    paddingLeft: 20,
    paddingTop: 30,
    color: "#919191"
  },

  alphabet_dark: {
    fontSize: 16,
    padding: 15,
    paddingLeft: 20,
    paddingTop: 30,
    color: "#aaa"
  },

  exerciseText_light: {
    fontSize: 19,
    color: "#515151"
  },

  exerciseText_dark: {
    fontSize: 19,
    color: "#eee"
  },

  exerciseContainer_light: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#eaeaea"
  },

  exerciseContainer_dark: {
    borderBottomWidth: 1,
    borderBottomColor: "#202020",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#181818"
  }
})