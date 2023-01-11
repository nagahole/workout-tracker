import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { persistor, Store } from './redux/store'
import { Text } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import WorkoutTrackerApp from "./WorkoutTrackerApp";

export default function App() {
  return (
    <Provider store={Store}>
    <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
      <GestureHandlerRootView style={{flex: 1}}>
        <WorkoutTrackerApp/>
      </GestureHandlerRootView>
    </PersistGate>
    </Provider>
    
  );
}