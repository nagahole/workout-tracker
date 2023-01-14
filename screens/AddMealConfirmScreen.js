import { useEffect, useState } from "react";
import { Button, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HelperFunctions from "../classes/HelperFunctions";
import { addMealInfoToDatabase } from "../redux/actions";
import DropDown from "react-native-paper-dropdown";
import { TextInput, withTheme } from "react-native-paper";
import { VictoryLabel, VictoryPie, VictoryTheme } from "victory-native";
import { PROTEIN_COLOR, FATS_COLOR, CARBS_COLOR } from "../components/widgets/DailyMacros";
import Svg from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import MealEntry from "../classes/MealEntry";

function AddMealConfirmScreen({navigation, route, theme}) {

  const isLightMode = HelperFunctions.isLightMode();

  const mealInfo = route.params.mealInfo?? route.params.mealEntry.mealInfo ?? null;
  const nutritionInfo = mealInfo.nutritionInfo;

  const [servingSizeDropdownVisible, setServingSizeDropdownVisible] = useState(false);

  const [servingSize, setServingSize] = useState(mealInfo.servingSize);

  let servingSizeNumeric = parseFloat(mealInfo.servingSize.split(' ')[0]);
  let servingSizeUnit = mealInfo.servingSize.split(' ').filter((val, i) => i >= 1).join(' ');

  const servingSizes = [
    {
      label: mealInfo.servingSize,
      value: mealInfo.servingSize,
    },
  ];

  if (servingSizeNumeric !== 1) {
    servingSizes.push({
      label: "1 " + servingSizeUnit,
      value: "1 " + servingSizeUnit,
    });
  }

  servingSizes.push({
    label: `1 container (${Math.round(servingSizeNumeric * mealInfo.servingsPerContainer * 10) / 10}${(servingSizeUnit === "" || servingSizeUnit === null)? "" : ` ${servingSizeUnit}`})`,
    value: "1 container"
  });

  const [numberOfServings, setNumberofServings] = useState(1);

  let effectiveServings; //Number of servings based on original serving size

  switch(servingSize) {
    case mealInfo.servingSize: //Serving size is original serving size
      effectiveServings = numberOfServings;
      break;
    case "1 " + servingSizeUnit: //Serving size is 1 / original serving size
      effectiveServings = numberOfServings / servingSizeNumeric;
      break;
    case "1 container":
      effectiveServings = numberOfServings * mealInfo.servingsPerContainer;
      break;
  }

  useEffect(() => {
    if (route.params.mode === 'edit') {
      setServingSize(route.params.mealEntry.servingSize);
      setNumberofServings(route.params.mealEntry.numberOfServings);

      navigation.addListener('beforeRemove', (e) => {

        route.params.openModal();
  
      })
    }
  }, [])
  

  const DATA = [
    {
      x: "Protein",
      y: nutritionInfo.protein * 4
    },
    {
      x: "Fats",
      y: nutritionInfo.fats * 9
    },
    {
      x: "Carbs",
      y: nutritionInfo.carbs * 4
    }
  ];

  let caloriesFromMacros = HelperFunctions.calculateCalories(nutritionInfo.protein, nutritionInfo.fats, nutritionInfo.carbs);

  return (
    <View style={[styles.container, {
      backgroundColor: isLightMode? null : '#222'
    }]}>
      <View style={isLightMode? styles.titleCard_light : styles.titleCard_dark}>
        <Text style={isLightMode? styles.title_light : styles.title_dark}>{mealInfo.description}</Text>
        <Text style={isLightMode? styles.subheading_light : styles.subheading_dark}>{mealInfo.brandName}</Text>
      </View>
      <ScrollView style={styles.bodyCard_light}>

        <View style={styles.row}>
          <Text style={[{flex: 1}, isLightMode? null : {
            color: 'white'
          }]}>Serving Size</Text>
          <View style={{flex: 2}}>
            <DropDown
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
              activeColor="#58A5F8"
              dropdownStyle={isLightMode? null : {
                backgroundColor: "#444",
                color: 'red'
              }}
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

              theme={theme}
            
              visible={servingSizeDropdownVisible}
              showDropDown={() => setServingSizeDropdownVisible(true)}
              onDismiss={() => setServingSizeDropdownVisible(false)}
              value={servingSize}
              setValue={setServingSize}
              list={servingSizes}
            />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={[{flex: 1}, isLightMode? null : {
            color: 'white'
          }]}>Number of Servings</Text>
          <View style={{flex: 2}}>
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
              
              value={numberOfServings.toString()}
              keyboardType="decimal-pad"
              onChangeText={text => setNumberofServings(text.replace(/[^0-9\.]/g, ''))}
              onEndEditing={() => { 
                let num = parseFloat(numberOfServings);
                if(isNaN(num)) {
                  setNumberofServings("");
                } else {
                  setNumberofServings(num.toString());
                }
              }} 
            />
          </View>
        </View>
        
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          paddingVertical: 35
        }}>
          <View style={{
            flex: 3,
            alignItems: 'center',
            justifyContent: 'center',
            height: 100
          }}>
            <Svg>
              <VictoryPie
                style={{
                  data: {
                    stroke: 'transparent'
                  }
                }}
                theme={VictoryTheme.material}
                innerRadius={40}
                radius={47}
                padAngle={1}
                width={94}
                height={94}
                data={DATA}
                labels={() => null}
                colorScale={[PROTEIN_COLOR, FATS_COLOR, CARBS_COLOR]}
              />
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                style={{ fontSize: 20, fill: isLightMode? 'black' : 'white', fontWeight: '600', lineHeight: 40 }}
                x={Dimensions.get('window').width * 0.122} y={Dimensions.get('window').width * 0.112}
                text={(Math.round(10 * effectiveServings * nutritionInfo.calories) / 10).toString().truncate(6)}
                />
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                style={{ fontSize: 16, fill: isLightMode? 'black' : 'white', fontWeight: '400', lineHeight: 40 }}
                x={Dimensions.get('window').width * 0.122} y={Dimensions.get('window').width * 0.155}
                text="cal"
                />
            </Svg>
          </View>
          <View style={{
            flex: 7,
            display: 'flex',
            flexDirection: 'row'
          }}>
            <View style={styles.macroContainer}>
              <Text style={{fontSize: 12, color: PROTEIN_COLOR}}>{Math.round(nutritionInfo.protein * 4 * 1000 / caloriesFromMacros) / 10}%</Text>
              <Text style={isLightMode? styles.macroGrams_light : styles.macroGrams_dark}>{Math.round(nutritionInfo.protein * effectiveServings * 10) / 10}g</Text>
              <Text style={isLightMode? styles.macroText_light : styles.macroText_dark}>Protein</Text>
            </View>
            <View style={styles.macroContainer}>
              <Text style={{fontSize: 12, color: FATS_COLOR}}>{Math.round(nutritionInfo.fats * 9 * 1000 / caloriesFromMacros) / 10}%</Text>
              <Text style={isLightMode? styles.macroGrams_light : styles.macroGrams_dark}>{Math.round(nutritionInfo.fats * effectiveServings * 10) / 10}g</Text>
              <Text style={isLightMode? styles.macroText_light : styles.macroText_dark}>Fats</Text>
            </View>
            <View style={styles.macroContainer}>
              <Text style={{fontSize: 12, color: CARBS_COLOR}}>{Math.round(nutritionInfo.carbs * 4 * 1000 / caloriesFromMacros) / 10}%</Text>
              <Text style={isLightMode? styles.macroGrams_light : styles.macroGrams_dark}>{Math.round(nutritionInfo.carbs * effectiveServings * 10) / 10}g</Text>
              <Text style={isLightMode? styles.macroText_light : styles.macroText_dark}>Carbs</Text>
            </View>
          </View>
        </View>

        <View style={{marginVertical: 15}}>
          <Button
            //I should probably change this and explicitly have a parameter called mode: "edit" instead of basing it on
            //Whether or not mealInfo is undefined
            title={(route.params.mealInfo === null || route.params.mealInfo === undefined)? "EDIT ENTRY" : "ADD ENTRY"}
            onPress={() => {
              let mealEntry = new MealEntry(mealInfo, servingSize, numberOfServings, effectiveServings);

              route.params.onConfirmSelection(mealEntry);
              navigation.goBack();
            }}
          />
        </View>

      </ScrollView>
    </View>
  )
}

export default withTheme(AddMealConfirmScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, 

  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },

  titleCard_light: {
    borderBottomColor: "#rgba(255,255,255,0.6)",
    borderBottomWidth: 2,
    padding: 15
  },

  titleCard_dark: {
    borderBottomColor: "#rgba(255,255,255,0.1)",
    borderBottomWidth: 2,
    padding: 15
  },

  bodyCard_light: {
    padding: 15
  },

  title_light: {
    fontSize: 30,
    fontWeight: 'bold'
  },

  title_dark: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },

  subheading_light: {
    color: '#515151'
  },

  subheading_dark: {
    color: '#aaa'
  },

  macroContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
    paddingHorizontal: 5
  },

  macroGrams_light: {
    fontSize: 17
  },

  macroGrams_dark: {
    color: 'white',
    fontSize: 17,
  },

  macroText_dark: {
    color: 'white',
    fontSize: 12
  }

});