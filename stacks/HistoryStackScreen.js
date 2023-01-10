import { createStackNavigator } from "@react-navigation/stack";
import ExerciseSelectScreen from "../screens/ExerciseSelectScreen";
import HistoryScreen from "../screens/HistoryScreen";
import WorkoutScreen from "../screens/WorkoutScreen";

const HistoryStack = createStackNavigator();

export default function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="Back" component={HistoryScreen} options={{headerShown: false}}/>
      <HistoryStack.Screen name="Edit Workout" component={WorkoutScreen} options={{headerShown: false}}/>
      <HistoryStack.Screen name="Add Exercise" component={ExerciseSelectScreen} options={{headerShown: true}}/>
    </HistoryStack.Navigator>
  );
}