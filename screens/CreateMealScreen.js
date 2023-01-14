import { useEffect, useState } from "react";
import { ScrollView, Button, Dimensions, FlatList, StyleSheet, Text, View, Alert } from "react-native";
import { Switch, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HelperFunctions from "../classes/HelperFunctions";
import Mealinfo from "../classes/MealInfo";
import NutritionInfo from "../classes/NutritionInfo";

export default function CreateMealScreen({navigation, route}) {

  const isLightMode = HelperFunctions.isLightMode();

  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");

  const [brandText, setBrandText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [servingSizeText, setServingSizeText] = useState("");
  const [servingsPerContainerText, setServingsPerContainerText] = useState("");

  const [useManualCalories, setUseManualCalories] = useState(false);
  const [manualCaloriesText, setManualCaloriesText] = useState("");
  const [displayInfoText, setDisplayInfoText] = useState(false);
  const [displayTimeout, setDisplayTimeout] = useState();

  const [proteinText, setProteinText] = useState("");
  const [fatsText, setFatsText] = useState("");
  const [carbsText, setCarbsText] = useState("");

  useEffect(() => {
    if (route.params.mealInfo !== undefined && route.params.mealInfo !== null) {
      let mealInfo = route.params.mealInfo;
  
      setBrandText(mealInfo.brandName);
      setDescriptionText(mealInfo.description);
      setServingSizeText(mealInfo.servingSize);
      setServingsPerContainerText(mealInfo.servingsPerContainer.toString());
  
      setUseManualCalories(true);
      setManualCaloriesText(mealInfo.nutritionInfo.calories.toString());
      setProteinText(mealInfo.nutritionInfo.protein.toString());
      setFatsText(mealInfo.nutritionInfo.fats.toString());
      setCarbsText(mealInfo.nutritionInfo.carbs.toString());
    }
  }, [])
  

  function addMealButton() {

    let caloriesNotEntered = useManualCalories? manualCaloriesText === "" : false;

    if (descriptionText === ""
      || servingSizeText === ""
      || servingsPerContainerText === ""
      || caloriesNotEntered
      || fatsText === ""
      || carbsText === ""
      || proteinText === "") {
      Alert.alert("Please fill out all the required fields");
      return;
    }

    let servingSizeNum = parseFloat(servingSizeText.split(' ')[0])

    if (isNaN(servingSizeNum)) {
      Alert.alert("Please enter a valid value for serving size", "eg. 3 tablespoons, 33 grams, 5 slices");
      return;
    }

    let protein = parseFloat(proteinText);
    let fats = parseFloat(fatsText);
    let carbs = parseFloat(carbsText);

    let calories = useManualCalories? parseFloat(manualCaloriesText)
    : HelperFunctions.calculateCalories(protein, fats, carbs);

    route.params.onMealCreated(new Mealinfo(brandText, descriptionText, servingSizeText, parseFloat(servingsPerContainerText),
      new NutritionInfo(
        calories,
        protein,
        fats,
        carbs
      )));
    navigation.goBack();
  }

  return (
    <View style={[styles.container, {
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: isLightMode? null : '#222'
    }]}>
      <ScrollView style={styles.scrollview} contentContainerStyle={{padding: 20}}>
        <Text style={[isLightMode? styles.subheading_light : styles.subheading_dark, {marginTop: 0}]}>Item Information</Text>
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Brand Name"
          placeholder="eg. Campbell's"
          placeholderTextColor="#aaa"
          value={brandText}
          onChangeText={text => setBrandText(text)}
        />
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Description *" 
          placeholder="eg. Chicken Soup"
          placeholderTextColor="#aaa"
          value={descriptionText}
          onChangeText={text => setDescriptionText(text)}
        />
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Serving Size *"
          placeholder="eg. 1 cup"
          placeholderTextColor="#aaa"
          value={servingSizeText}
          onChangeText={text => setServingSizeText(text)}
        />
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Servings per container *"
          keyboardType="decimal-pad"
          placeholder="1"
          placeholderTextColor="#aaa"
          value={servingsPerContainerText}
          onChangeText={text => setServingsPerContainerText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(servingsPerContainerText);
            if(isNaN(num)) {
              setServingsPerContainerText("");
            } else {
              setServingsPerContainerText(num.toString());
            }
          }}        />

        <Text style={isLightMode? styles.subheading_light : styles.subheading_dark}>Nutrition Facts <Text style={{color: '#919191', fontSize: 12}}>(per serving size)</Text></Text>
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}

          label="Calories *"
          disabled={!useManualCalories}
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={function() {
            let protein = parseFloat(proteinText);
            let fats = parseFloat(fatsText);
            let carbs = parseFloat(carbsText);

            let calories = HelperFunctions.calculateCalories(protein, fats, carbs);
            
            return useManualCalories? manualCaloriesText
            : isNaN(calories)? null : (Math.round(10 * calories) / 10).toString()
          }()}
          onChangeText={text => setManualCaloriesText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(manualCaloriesText);
            if(isNaN(num)) {
              setManualCaloriesText("");
              return;
            } 

            let protein = parseFloat(proteinText);
            let fats = parseFloat(fatsText);
            let carbs = parseFloat(carbsText);

            let calculatedCalories = HelperFunctions.calculateCalories(protein, fats, carbs);

            if (calculatedCalories > num) {
              setManualCaloriesText(calculatedCalories.toString());
              setDisplayInfoText(true);

              clearTimeout(displayTimeout);

              setDisplayTimeout(setTimeout(() => {
                setDisplayInfoText(false);
              }, 5000))

            } else {
              setManualCaloriesText(num.toString());
            }

          }}
        />

        {
          displayInfoText? 
          <Text style={{
            textAlign: 'center',
            color: '#c85b5b',
            marginTop: 10
          }}>Manually entered calories must be greater than the calories calculated from inputted macros</Text>
          : null
        }

        <View style={{
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          marginVertical: 10
          }}
        >
          <Text style={{
            color: "#919191",
            fontSize: 16,
            marginRight: 10,
            marginTop: -1
          }}>Enter calories manually</Text>
          <Switch value={useManualCalories} onValueChange={bool => setUseManualCalories(bool)}/>
        </View>

        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Protein (g) *"
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={proteinText}
          onChangeText={text => setProteinText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(proteinText);
            if(isNaN(num)) {
              setProteinText("");
            } else {
              setProteinText(num.toString());
            }
          }}        
        />
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Total Fat (g) *"
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={fatsText}
          onChangeText={text => setFatsText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(fatsText);
            if(isNaN(num)) {
              setFatsText("");
            } else {
              setFatsText(num.toString());
            }
          }}        
        />
        <TextInput
          contentStyle={isLightMode? null : {
            backgroundColor: "#444",
            color: "white"
          }}
          outlineStyle={isLightMode? null : {
            borderColor: '#444'
          }}
          underlineColor={isLightMode? null : "#919191"}
          activeUnderlineColor={isLightMode? null : "#aaa"}
          mode={isLightMode? "outlined" : "flat"} 
          textColor={isLightMode? null : 'white'}
          style={{marginBottom: 5}}

          label="Total Carbohydrates (g) *"
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={carbsText}
          onChangeText={text => setCarbsText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(carbsText);
            if(isNaN(num)) {
              setCarbsText("");
            } else {
              setCarbsText(num.toString());
            }
          }}        
        />
        

        <View style={{marginVertical: 20}}>
          <Button
            title={route.params.mode === "edit"? "EDIT FOOD" : "CREATE MEAL / FOOD"}
            onPress={() => {addMealButton()}}
          />
        </View>
        <View style={{height: 200}}></View>
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  scrollview: {
    width: Dimensions.get('window').width,
    flex: 1
  },

  subheading_light: {
    marginTop: 25,
    marginBottom: 5,
    fontSize: 16
  },

  subheading_dark: {
    color: 'white',
    marginTop: 25,
    marginBottom: 5,
    fontSize: 16
  }
});