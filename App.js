import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import StartWorkoutStackScreen from "./stacks/StartWorkoutStackScreen";
import SettingsStackScreen from "./stacks/SettingsStackScreen";
import ExercisesStackScreen from "./stacks/ExercisesStackScreen";
import HistoryStackScreen from "./stacks/HistoryStackScreen";
import ProfileStackScreen from "./stacks/ProfileStackScreen";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons/faSquareCheck";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { faCircleInfo, faPlus, faStar, faStopwatch20, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Provider, useDispatch } from 'react-redux';
import { persistor, Store } from './redux/store'
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { faNoteSticky, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { PersistGate } from "redux-persist/integration/react";
import HelperFunctions from "./classes/HelperFunctions";
import { useEffect } from "react";
import { setWorkouts } from "./redux/actions";

library.add(faSquareCheck, faStopwatch20, faXmark, faNoteSticky, faCircleInfo, faPlus, faPenToSquare, faStar);

const Tab = createBottomTabNavigator();

StatusBar.setBarStyle('dark-content', true);

export default function App() {
  return (
    <Provider store={Store}>
    <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Start Workout"
            screenOptions={({ route }) => ({
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
      </GestureHandlerRootView>
    </PersistGate>
    </Provider>
    
  );
}