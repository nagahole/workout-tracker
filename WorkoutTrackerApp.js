import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import StartWorkoutStackScreen from "./stacks/StartWorkoutStackScreen";
import SettingsStackScreen from "./stacks/SettingsStackScreen";
import ExercisesStackScreen from "./stacks/ExercisesStackScreen";
import HistoryStackScreen from "./stacks/HistoryStackScreen";
import ProfileStackScreen from "./stacks/ProfileStackScreen";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons/faSquareCheck";
import { faArrowLeftLong, faArrowRightLong, faBullseye, faCircleInfo, faPlus, faStar, faStopwatch20, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faNoteSticky, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import HelperFunctions from "./classes/HelperFunctions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { setMeals, setTargetOnDay, SET_MEALS } from "./redux/actions";
import NutritionInfo from "./classes/NutritionInfo";

library.add(faSquareCheck, faStopwatch20, faXmark, faNoteSticky, 
  faCircleInfo, faPlus, faPenToSquare, faStar, faBullseye,
  faArrowLeftLong, faArrowRightLong);

const Tab = createBottomTabNavigator();

export default function WorkoutTrackerApp() {

  const dispatch = useDispatch();

  const targets = useSelector(state => state.macroTargets);

  const isLightMode = HelperFunctions.isLightMode();

  useEffect(() => {
    dispatch(setTargetOnDay(targets.default, new Date()));
  }, []);

  useEffect(() => {
    if (isLightMode) {
      StatusBar.setBarStyle('dark-content', true);
    } else {
      StatusBar.setBarStyle('light-content', true);
    }
  }, [])

  return (
    <NavigationContainer
      theme={isLightMode? DefaultTheme : DarkTheme}
    >
      <Tab.Navigator
        initialRouteName="Start Workout"
        screenOptions={({ route }) => ({
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Start Workout') {
              iconName = focused? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            } else if (route.name === 'Exercises') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            headerShown: false, 
            tabBarActiveBackgroundColor: '#58A5F8',
            tabBarActiveTintColor: 'white'
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryStackScreen}
          options={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#58A5F8',
            tabBarActiveTintColor: 'white'
          }}
        />
        <Tab.Screen
          name="Start Workout"
          component={StartWorkoutStackScreen}
          options={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#58A5F8',
            tabBarActiveTintColor: 'white'
          }}
        />
        <Tab.Screen
          name="Exercises"
          component={ExercisesStackScreen}
          options={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#58A5F8',
            tabBarActiveTintColor: 'white'
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackScreen}
          options={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#58A5F8',
            tabBarActiveTintColor: 'white'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}