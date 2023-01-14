import { useEffect, useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { Switch, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import HelperFunctions from "../classes/HelperFunctions";
import NutritionInfo from "../classes/NutritionInfo";
import { setTarget, setTargetOnDay } from "../redux/actions";

export default function MacroTargetsScreen({navigation, route}) {

  const isLightMode = HelperFunctions.isLightMode();

  const insets = useSafeAreaInsets();

  const [useManualCalories, setUseManualCalories] = useState(false);
  const [manualCaloriesText, setManualCaloriesText] = useState("");
  const [displayInfoText, setDisplayInfoText] = useState(false);
  const [displayTimeout, setDisplayTimeout] = useState();

  const [proteinText, setProteinText] = useState("");
  const [fatsText, setFatsText] = useState("");
  const [carbsText, setCarbsText] = useState("");

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displaySuccessTimeout, setDisplaySuccessTimeout] = useState();

  const dispatch = useDispatch();

  useEffect(() => {

    navigation.addListener('beforeRemove', (e) => {

      route.params.openModal();

    })
  }, [])

  return (
    <View style={[styles.container, {
      backgroundColor: isLightMode? 'transparent' : '#222'
    }]}>
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

      <View style={{
        marginTop: 20,
        marginVertical: 10
      }}>
        <Button
          title="MACRO CALCULATOR"
          onPress={() => {
            navigation.navigate("Macro Calculator", {
              onCalculated: nutritionInfo => {
                setUseManualCalories(true);
                setManualCaloriesText(nutritionInfo.calories.toString());

                setProteinText(nutritionInfo.protein.toString());
                setFatsText(nutritionInfo.fats.toString());
                setCarbsText(nutritionInfo.carbs.toString());
              }
            });
          }}
        />
      </View>
      
      <View style={{
        marginBottom: 30
      }}>
        <Button
          title="SET TARGETS"
          onPress={() => {
            let caloriesNotEntered = useManualCalories? manualCaloriesText === "" : false;

            if (caloriesNotEntered
              || fatsText === ""
              || carbsText === ""
              || proteinText === "") {
              Alert.alert("Please fill out all the required fields");
              return;
            }

            let protein = parseFloat(proteinText);
            let fats = parseFloat(fatsText);
            let carbs = parseFloat(carbsText);

            let calories = useManualCalories? parseFloat(manualCaloriesText)
            : HelperFunctions.calculateCalories(protein, fats, carbs);

            let nutritionInfo = new NutritionInfo(calories, protein, fats, carbs);

            dispatch(setTarget(nutritionInfo));
            dispatch(setTargetOnDay(nutritionInfo, new Date()));

            clearTimeout(displaySuccessTimeout);

            setDisplaySuccess(true);

            setDisplaySuccessTimeout(setTimeout(() => {
              setDisplaySuccess(false);
            }, 5000))
          }}
        />
      </View>

      {
        !displaySuccess? null :
          <View style={styles.successCard_light}>
            <Text style={{textAlign: 'center'}}>You've successfully set your target calories!</Text>
          </View>
      }
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

  successCard_light: {
    width: '100%',
    backgroundColor: '#AFE1AF',
    padding: 15,
    borderRadius: 3
  }
});