import WorkoutExercise from '../classes/WorkoutExercise';
import WorkoutTemplate from '../classes/WorkoutTemplate'
import { Exercises } from './Exercises';

export const WorkoutTemplates = [
  new WorkoutTemplate("Push", [
    new WorkoutExercise(Exercises.overheadPressDumbbell, 3),
    new WorkoutExercise(Exercises.benchPressBarbell, 3),
    new WorkoutExercise(Exercises.inclineBenchPressSmithMachine, 3),
    new WorkoutExercise(Exercises.jmPressSmith, 3),
    new WorkoutExercise(Exercises.crossBodyTricepPushdownCable, 3),
    new WorkoutExercise(Exercises.lateralRaisesCable, 3),
  ]),

  new WorkoutTemplate("Pull", [
    new WorkoutExercise(Exercises.inclineRowsDumbbells, 3),
    new WorkoutExercise(Exercises.latPulldownsMachine, 3),
    new WorkoutExercise(Exercises.rowsCable, 3),
    new WorkoutExercise(Exercises.bicepCurlsDumbbells, 3),
    new WorkoutExercise(Exercises.rearDeltFlyesCable, 3),
  ]),

  new WorkoutTemplate("Legs", [
    new WorkoutExercise(Exercises.hackSquats, 3),
    new WorkoutExercise(Exercises.legPress, 3),
    new WorkoutExercise(Exercises.hamstringCurls, 3),
  ]),
];