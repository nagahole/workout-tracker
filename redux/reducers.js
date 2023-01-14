import NutritionInfo from "../classes/NutritionInfo";
import { ADD_MEAL, ADD_MEALINFO_TO_DATABASE, ADD_MEAL_ON_DATE, ADD_TEMPLATE, ADD_WORKOUT, SET_DATE_FOR_DAILY_MACROS, SET_MEALINFO_DATABASE, SET_MEALS, SET_TARGET, SET_TARGETS, SET_TARGET_ON_DAY, SET_TEMPLATES, SET_THEME, SET_WORKOUTS } from "./actions";
import structuredClone from 'realistic-structured-clone';

const initialState = {
  workouts: [],
  templates: [],
  theme: 'dark',
  mealDatabase: [],
  mealEntries: {},
  //Default macro targets based on 50% carbs 30% protein 20% fats 2250 cals
  macroTargets: { default: new NutritionInfo(2250, 168.75, 50, 281.25)},
  dateForDailyMacros: new Date(Date.now())
}

function workoutReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WORKOUTS:
      return { ...state, workouts: action.payload };
    case ADD_WORKOUT:
      return { ...state, workouts: [action.payload, ...state.workouts] }
    case SET_TEMPLATES:
      return { ...state, templates: action.payload }
    case ADD_TEMPLATE:
      return { ...state, templates: [action.payload, ...state.templates] }
    case SET_THEME: 
      return { ...state, theme: action.payload}
    case SET_MEALINFO_DATABASE:
      return { ...state, mealDatabase: action.payload}
    case ADD_MEALINFO_TO_DATABASE:
      return { ...state, mealDatabase: [action.payload, ...state.mealDatabase]}
    case SET_MEALS:
      return { ...state, mealEntries: action.payload }
    case ADD_MEAL:
      let meals = structuredClone(state.mealEntries);
      let mealEntry = action.payload;

      /*
      export default class MealEntry {
        constructor(mealInfo, servingSize, numberOfServings) {
          this.mealinfo = mealInfo;
          this.servingSize = servingSize;
          this.numberOfServings = numberOfServings;
          this.date = new Date();
        }
      }
      */

      let dateString = mealEntry.date.toLocaleDateString("en-NZ");

      if (meals.hasOwnProperty(dateString)) {
        meals[dateString].unshift(mealEntry);
      } else {
        meals[dateString] = [mealEntry];
      }
      return { ...state, mealEntries: meals}
      case ADD_MEAL_ON_DATE:
        meals = structuredClone(state.mealEntries);
        mealEntry = action.payload.mealEntry;
  
        dateString = action.payload.date.toLocaleDateString("en-NZ");
  
        if (meals.hasOwnProperty(dateString)) {
          meals[dateString].unshift(mealEntry);
        } else {
          meals[dateString] = [mealEntry];
        }

        return { ...state, mealEntries: meals}
    case SET_TARGETS:
      return { ...state, macroTargets: action.payload }
    case SET_TARGET_ON_DAY:
      let targets = structuredClone(state.macroTargets);
      dateString = action.payload.date.toLocaleDateString("en-NZ");

      targets[dateString] = action.payload.nutritionInfo;

      return { ...state, macroTargets: targets };
    case SET_TARGET: 
      targets = structuredClone(state.macroTargets);

      targets.default = action.payload;

      return { ...state, macroTargets: targets}
    case SET_DATE_FOR_DAILY_MACROS:
      return { ...state, dateForDailyMacros: action.payload }
    default:
      return state;
  }
}

export default workoutReducer;