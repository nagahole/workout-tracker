import { useEffect, useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Switch, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import HelperFunctions from "../classes/HelperFunctions";
import NutritionInfo from "../classes/NutritionInfo";
import { setTarget, setTargetOnDay } from "../redux/actions";

export default function MacroCalculatorScreen({navigation, route}) {

  const isLightMode = HelperFunctions.isLightMode();

  const insets = useSafeAreaInsets();

  const [sex, setSex] = useState("M");
  const [sexDropdownVisible, setSexDropdownVisible] = useState(false);
  const [ageText, setAgeText] = useState("");
  const [weightText, setWeightText] = useState("");
  const [heightText, setHeightText] = useState("");

  const [activityLevel, setActivitylevel] = useState("sedentary");
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false);

  const [goal, setGoal] = useState("maintain weight");
  const [goalDropdownVisible, setGoalDropdownVisible] = useState(false);
  

  const dispatch = useDispatch();

  /*
    GENDER
    AGE
    WEIGHT
    HEIGHT
    ACTIVITY
  */

  const sexes = [
    {
      label: "Male",
      value: "M",
    },
    {
      label: "Female",
      value: "F"
    }
  ]

  const activityLevels = [
    {
      label: "Sedentary (Little or no exercise)",
      value: "sedentary",
    },
    {
      label: "Slightly Active (Exercise 1-3x/wk)",
      value: "slightly active"
    },
    {
      label: "Moderately Active (Exercise 3-5x/wk)",
      value: "moderately active",
    },
    {
      label: "Very Active (Exercise 6-7x/wk)",
      value: "very active"
    },
    {
      label: "Extremely Active (Regular training)",
      value: "extremely active",
    },
  ];

  const goals = [
    {
      label: "Gain Weight",
      value: "gain weight",
    },
    {
      label: "Maintain Weight",
      value: "maintain weight"
    },
    {
      label: "Lose Weight",
      value: "lose weight"
    },
  ]

  return (
    <View style={[styles.container, {
      backgroundColor: isLightMode? 'transparent' : '#222'
    }]}>
      <ScrollView>
        <View style={{
          marginBottom: 5
        }}>
          <DropDown
            label="Sex"
            mode={isLightMode? "outlined" : "flat"} 
            activeColor="#58A5F8"
            dropDownItemStyle={isLightMode? null : {
              backgroundColor: "#444"
            }}
            dropDownItemSelectedStyle={isLightMode? null : {
              backgroundColor: "#444"
            }}

            dropDownItemTextStyle={isLightMode? null : {
              color: "#919191"
            }}
            dropDownItemSelectedTextStyle={isLightMode? null : {
              color: "#58A5F8",
              fontWeight: 'bold'
            }}
          
            visible={sexDropdownVisible}
            showDropDown={() => setSexDropdownVisible(true)}
            onDismiss={() => setSexDropdownVisible(false)}
            value={sex}
            setValue={setSex}
            list={sexes}
          />
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

          label="Age *"
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={ageText}
          onChangeText={text => setAgeText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(ageText);
            if(isNaN(num)) {
              setAgeText("");
            } else {
              setAgeText(num.toString());
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

          label="Weight (kg) *"
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={weightText}
          onChangeText={text => setWeightText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(weightText);
            if(isNaN(num)) {
              setWeightText("");
            } else {
              setWeightText(num.toString());
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

          label="Height (cm) *"
          keyboardType="decimal-pad"
          placeholder="Required"
          placeholderTextColor="#aaa"
          value={heightText}
          onChangeText={text => setHeightText(text.replace(/[^0-9\.]/g, ''))}
          onEndEditing={() => { 
            let num = parseFloat(heightText);
            if(isNaN(num)) {
              setHeightText("");
            } else {
              setHeightText(num.toString());
            }
          }}        
        />

        <View style={{
          marginBottom: 5
        }}>
          <DropDown
            label="Activity Level"
            mode={isLightMode? "outlined" : "flat"} 
            activeColor="#58A5F8"
            dropDownItemStyle={isLightMode? null : {
              backgroundColor: "#444",
            }}
            dropDownItemSelectedStyle={isLightMode? null : {
              backgroundColor: "#444"
            }}

            dropDownItemTextStyle={[{
              fontSize: 10
            },isLightMode? null : {
              color: "#919191",
            }]}
            dropDownItemSelectedTextStyle={[{
              fontSize: 10
            },isLightMode? null : {
              color: "#58A5F8",
              fontWeight: 'bold',
            }]}
          
            visible={activityDropdownVisible}
            showDropDown={() => setActivityDropdownVisible(true)}
            onDismiss={() => setActivityDropdownVisible(false)}
            value={activityLevel}
            setValue={setActivitylevel}
            list={activityLevels}
          />
        </View>

        <DropDown
          label="Goal"
          mode={isLightMode? "outlined" : "flat"} 
          activeColor="#58A5F8"
          dropDownItemStyle={isLightMode? null : {
            backgroundColor: "#444",
          }}
          dropDownItemSelectedStyle={isLightMode? null : {
            backgroundColor: "#444"
          }}

          dropDownItemTextStyle={[{
            fontSize: 10
          },isLightMode? null : {
            color: "#919191",
          }]}
          dropDownItemSelectedTextStyle={[{
            fontSize: 10
          },isLightMode? null : {
            color: "#58A5F8",
            fontWeight: 'bold',
          }]}
        
          visible={goalDropdownVisible}
          showDropDown={() => setGoalDropdownVisible(true)}
          onDismiss={() => setGoalDropdownVisible(false)}
          value={goal}
          setValue={setGoal}
          list={goals}
        />
        
        <View style={{
          marginVertical: 30
        }}>
          <Button
            title="CALCULATE MACROS"
            onPress={() => {

              if (ageText === ""
              || weightText === ""
              || heightText === "") {
                Alert.alert("Please fill out the required fields");
                return;
              }

              let age = parseFloat(ageText);
              let weight = parseFloat(weightText);
              let height = parseFloat(heightText);
              
              let bmr;

              if(sex === 'M') {
                console.log("MALE");
                //BMR (M) = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years)
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
              } else {
                console.log("FEMALE");
                //BMR (F)= 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.33 * age);
              }

              let modifier;

              switch(activityLevel) {
                case "sedentary":
                  modifier = 1.2;
                  break;
                case "slightly active":
                  modifier = 1.375;
                  break;
                case "moderately active":
                  modifier = 1.55;
                  break;
                case "very active":
                  modifier = 1.725;
                  break;
                case "extremely active":
                  modifier = 1.9;
                  break;
                default:
                  Alert.alert("ERROR: Activity level not recognized!");
                  return;
              }

              let tdee = bmr * modifier;

              let caloriesGoal = tdee;
              let proteinProp;
              let fatsProp;
              let carbsProp;

              switch(goal) {
                case "gain weight":
                  caloriesGoal += 400;
                  proteinProp = 0.3;
                  fatsProp = 0.15;
                  carbsProp = 0.55
                  break;
                case "maintain weight":
                  caloriesGoal += 0;
                  proteinProp = 0.3;
                  fatsProp = 0.15;
                  carbsProp = 0.55
                  break;
                case "lose weight":
                  caloriesGoal -= 500;
                  proteinProp = 0.3;
                  fatsProp = 0.15;
                  carbsProp = 0.55
                  break;
                default:
                  Alert.alert("ERR: Goal not recognised");
                  return;
              }

              let nutritionInfo = new NutritionInfo(
                Math.ceil(caloriesGoal),
                Math.round(caloriesGoal * proteinProp / 4),
                Math.round(caloriesGoal * fatsProp / 9),
                Math.round(caloriesGoal * carbsProp / 4)
              );

              route.params.onCalculated(nutritionInfo);
              navigation.goBack();
            }}
          />
        </View>

      </ScrollView>
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