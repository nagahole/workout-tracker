import { createStackNavigator } from "@react-navigation/stack";
import ExerciseSelectScreen from "../screens/ExerciseSelectScreen";
import FinishedWorkoutScreen from "../screens/FinishedWorkoutScreen";
import StartWorkoutScreen from "../screens/StartWorkoutScreen";
import WorkoutScreen from "../screens/WorkoutScreen";

const StartWorkoutStack = createStackNavigator();

export default function StartWorkoutStackScreen() {
  return (
    <StartWorkoutStack.Navigator>
      <StartWorkoutStack.Screen name="Back" component={StartWorkoutScreen} options={{headerShown: false}}/>
      <StartWorkoutStack.Screen name="Workout" component={WorkoutScreen} options={{headerShown: false, gestureEnabled: false}}/>
      <StartWorkoutStack.Screen name="Add Exercise" component={ExerciseSelectScreen} options={{headerShown: true}}/>
      <StartWorkoutStack.Screen name="Finished Workout" component={FinishedWorkoutScreen} options={{headerShown: false}}/>
    </StartWorkoutStack.Navigator>
  );
}