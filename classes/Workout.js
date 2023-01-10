export default class Workout {
  constructor(name, notes, workoutExercises, date = Date.now()) {
    this.name = name;
    this.notes = notes;
    this.workoutExercises = workoutExercises;
    this.date = date;
  }
}