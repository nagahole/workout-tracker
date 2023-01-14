export default class Mealinfo {
  constructor(brandName, description, servingSize, servingsPerContainer, nutritionInfo) {
    this.brandName = brandName;
    this.description = description;
    this.servingSize = servingSize;
    this.servingsPerContainer = servingsPerContainer;
    this.nutritionInfo = nutritionInfo;
    this.id = Date.now();
  }
}