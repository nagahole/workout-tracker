export const SET_WORKOUTS = 'SET_WORKOUTS';
export const ADD_WORKOUT = 'ADD_WORKOUT';
export const SET_TEMPLATES = 'SET_TEMPLATES';
export const ADD_TEMPLATE = 'ADD_TEMPLATE';
export const SET_THEME = 'SET_THEME';

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