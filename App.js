import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { persistor, Store } from './redux/store'
import { Text } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import WorkoutTrackerApp from "./WorkoutTrackerApp";
import { DefaultTheme, Provider } from "react-native-paper";


export default function App() {

  return (
    <ReduxProvider store={Store}>
    <Provider>
    <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
      <GestureHandlerRootView style={{flex: 1}}>
        <WorkoutTrackerApp/>
      </GestureHandlerRootView>
    </PersistGate>
    </Provider>
    </ReduxProvider>
    
  );
}