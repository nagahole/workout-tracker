export const SET_WORKOUTS = 'SET_WORKOUTS';
export const ADD_WORKOUT = 'ADD_WORKOUT';
export const SET_TEMPLATES = 'SET_TEMPLATES';
export const ADD_TEMPLATE = 'ADD_TEMPLATE';
export const SET_THEME = 'SET_THEME';
export const SET_MEALINFO_DATABASE = 'SET_MEALINFO_DATABASE';
export const ADD_MEALINFO_TO_DATABASE = 'ADD_MEALINFO_TO_DATABASE';
export const SET_MEALS = 'SET_MEALS';
export const ADD_MEAL = 'ADD_MEAL';
export const ADD_MEAL_ON_DATE = 'ADD_MEAL_ON_DATE';
export const SET_TARGETS = 'SET_TARGETS';
export const SET_TARGET_ON_DAY = 'SET_TARGET_ON_DAY';
export const SET_TARGET = 'SET_TARGET';
export const SET_DATE_FOR_DAILY_MACROS = 'SET_DATE_FOR_DAILY_MACROS';

export const setWorkouts = workouts => dispatch => {
  dispatch({
    type: SET_WORKOUTS,
    payload: workouts
  });
};

export const addWorkout = workout => dispatch => {
  dispatch({
    type: ADD_WORKOUT,
    payload: workout
  });
}

export const setTemplates = templates => dispatch => {
  dispatch({
    type: SET_TEMPLATES,
    payload: templates
  });
};

export const addTemplate = template => dispatch => {
  dispatch({
    type: ADD_TEMPLATE,
    payload: template
  });
}

export const setTheme = theme => dispatch => {
  dispatch({
    type: SET_THEME,
    payload: theme
  });
}

export const setMealInfoDatabase = mealInfos => dispatch => {
  dispatch({
    type: SET_MEALINFO_DATABASE,
    payload: mealInfos
  });
}

export const addMealInfoToDatabase = mealInfo => dispatch => {
  dispatch({
    type: ADD_MEALINFO_TO_DATABASE,
    payload: mealInfo
  });
}

export const setMeals = mealEntry => dispatch => {
  dispatch({
    type: SET_MEALS,
    payload: mealEntry
  });
}

export const addMeal = mealEntry => dispatch => {
  dispatch({
    type: ADD_MEAL,
    payload: mealEntry
  });
}

export const addMealOnDate = (mealEntry, date) => dispatch => {
  dispatch({
    type: ADD_MEAL_ON_DATE,
    payload: {
      mealEntry,
      date
    }
  });
}

export const setTargets = targets => dispatch => {
  dispatch({
    type: SET_TARGETS,
    payload: targets
  });
}

export const setTargetOnDay = (nutritionInfo, date) => dispatch => {
  dispatch({
    type: SET_TARGET_ON_DAY,
    payload: {
      nutritionInfo,
      date
    }
  });
}

export const setTarget = nutritionInfo => dispatch => {
  dispatch({
    type: SET_TARGET,
    payload: nutritionInfo
  });
}

export const setDateForDailyMacros = date => dispatch => {
  dispatch({
    type: SET_DATE_FOR_DAILY_MACROS,
    payload: date
  });
}