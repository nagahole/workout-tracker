import WeightAndReps from "./WeightAndReps";

export default class WorkoutExercise {
  constructor(exercise, sets){
    this.exercise = exercise;
    this.id = WorkoutExercise.count++;

    if (typeof sets === typeof 0) {
      this.sets = [];
      for(let i = 0; i < sets; i++) {
        this.sets.push(new WeightAndReps());
      }
    } else {
      this.sets = sets;
    }
  }
}

WorkoutExercise.count = 0;