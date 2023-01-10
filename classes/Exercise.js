export default class Exercise {
  constructor(name) {
    this.name = name;
    this.id = name.toLowerCase().replace(/ /g,"_");
    Exercise.count++;
  }
}