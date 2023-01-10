import WorkoutExercise from '../classes/WorkoutExercise';
import WorkoutTemplate from '../classes/WorkoutTemplate'
import { Exercises } from './Exercises';

export const WorkoutTemplates = [
  new WorkoutTemplate("Push", [
    new WorkoutExercise(Exercises.overheadPressDumbbell, 3),
    new WorkoutExercise(Exercises.benchPressBarbell, 3),
    new WorkoutExercise(Exercises.inclineBenchPressSmithMachine, 3),
    new WorkoutExercise(Exercises.jmPressSmithMachine, 3),
    new WorkoutExercise(Exercises.crossBodyTricepPushdownCable, 3),
    new WorkoutExercise(Exercises.lateralRaiseCable, 3),
  ]),

  new WorkoutTemplate("Pull", [
    new WorkoutExercise(Exercises.inclineRowsDumbbell, 3),
    new WorkoutExercise(Exercises.latPulldownCable, 3),
    new WorkoutExercise(Exercises.cableRowSingleArm, 3),
    new WorkoutExercise(Exercises.latPulldownCable, 3),
    new WorkoutExercise(Exercises.bicepCurlDumbbell, 3),
    new WorkoutExercise(Exercises.reverseFlyCable, 3),
  ]),

  new WorkoutTemplate("Legs", [
    new WorkoutExercise(Exercises.hackSquats, 3),
    new WorkoutExercise(Exercises.legPress, 3),
    new WorkoutExercise(Exercises.hamstringCurl, 3),
    new WorkoutExercise(Exercises.standingCalfRaiseMachine, 3),
  ]),
];