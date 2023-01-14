import { createStackNavigator } from "@react-navigation/stack";
import AddMealConfirmScreen from "../screens/AddMealConfirmScreen";
import AddMealScreen from "../screens/AddMealScreen";
import CreateMealScreen from "../screens/CreateMealScreen";
import MacroTargetsScreen from "../screens/MacroTargetsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const ProfileStack = createStackNavigator();

export default function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Back" component={ProfileScreen} options={{headerShown: false}}/>
      <ProfileStack.Screen name="Add Meal" component={AddMealScreen} options={{headerShown: true}}/>
      <ProfileStack.Screen name="Create Meal" component={CreateMealScreen} options={{headerShown: true}} />
      <ProfileStack.Screen name="Edit Meal" component={CreateMealScreen} options={{headerShown: true}} />
      <ProfileStack.Screen name="Add Meal Confirm" component={AddMealConfirmScreen} options={{headerShown: true, title: "Add Meal"}} />
      <ProfileStack.Screen name="Edit Meal Confirm" component={AddMealConfirmScreen} options={{headerShown: true, title: "Edit Meal"}} />
      <ProfileStack.Screen name="Macro Targets" component={MacroTargetsScreen} options={{headerShown: true, title: "Macro Targets"}} />
    </ProfileStack.Navigator>
  );
}