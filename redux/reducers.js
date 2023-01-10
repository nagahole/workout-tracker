import { ADD_TEMPLATE, ADD_WORKOUT, SET_TEMPLATES, SET_WORKOUTS } from "./actions";

const initialState = {
  workouts: [],
  templates: []
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
    default:
      return state;
  }
}

export default workoutReducer;