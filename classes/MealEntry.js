export default class MealEntry {
  constructor(mealInfo, servingSize, numberOfServings, effectiveServings) {
    this.mealInfo = mealInfo;
    this.servingSize = servingSize;
    this.numberOfServings = numberOfServings;
    this.effectiveServings = effectiveServings
    this.date = new Date();

    //I will have to work on a better ID later
    this.id = Date.now();
  }
}