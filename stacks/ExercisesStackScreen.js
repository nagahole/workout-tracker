import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ExerciseInfoScreen from "../screens/ExerciseInfoScreen";
import ExerciseSelectScreen from "../screens/ExerciseSelectScreen";

const ExercisesStack = createStackNavigator();

export default class ExercisesStackScreen extends React.Component {
  render() {
    return (
      <ExercisesStack.Navigator>
        <ExercisesStack.Screen name="Back" component={ExerciseSelectScreen} options={{headerShown: false, title: "Back"}} 
          initialParams={{
            onExerciseSelected: () => {},
            accountForStatusBarHeight: true,
            goToExerciseInfo: true
          }}/>
        <ExercisesStack.Screen name="Exercise Info" component={ExerciseInfoScreen} options={{headerShown: true}}/>
      </ExercisesStack.Navigator>
    );
  }
}