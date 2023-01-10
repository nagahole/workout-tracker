import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HistoryScreen from "./ExerciseInfoScreens/HistoryScreen";
import ChartsScreen from "./ExerciseInfoScreens/ChartsScreen";
import RecordsScreen from "./ExerciseInfoScreens/RecordsScreen";

const Tab = createMaterialTopTabNavigator();


export default function ExerciseInfoScreen({route, navigation}) {

  //basically constructor
  useEffect(() => {
    navigation.setOptions({title: route.params.exercise.name});
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="History" component={HistoryScreen} initialParams={{exercise: route.params.exercise}}/>
      <Tab.Screen name="Charts" component={ChartsScreen} initialParams={{exercise: route.params.exercise}}/>
      <Tab.Screen name="Records" component={RecordsScreen} initialParams={{exercise: route.params.exercise}}/>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});