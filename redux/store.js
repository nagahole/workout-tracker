import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import workoutReducer from './reducers';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, workoutReducer);

//const rootReducer = combineReducers({workoutReducer});

export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);