class Exercise {
  constructor(name) {
    this.name = name;
    this.id = Exercise.count;
    Exercise.count++;
  }
}

Exercise.count = 0;

export default Exercise;