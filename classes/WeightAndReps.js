export default class WeightAndReps {
  constructor(weight = -1337, reps = -1337, completed = false) {
    this.weight = weight;
    this.reps = reps;
    this.completed = completed;
    this.id = WeightAndReps.count++;
  }
}

WeightAndReps.count = 0;