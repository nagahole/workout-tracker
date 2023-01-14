import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryPie, VictoryTheme } from "victory-native";
import HelperFunctions from "../../classes/HelperFunctions";
import * as Progress from 'react-native-progress';
import { setDateForDailyMacros, setTargets } from "../../redux/actions";
import NutritionInfo from "../../classes/NutritionInfo";
import { useEffect, useState } from "react";

export const PROTEIN_COLOR = '#58A5F8';
export const FATS_COLOR = 'red';
export const CARBS_COLOR = '#97C15C';
export const OTHER_COLOR = '#919191';
export const MISSING_COLOR = 'transparent';

export default function DailyMacros(props) {

  const isLightMode = HelperFunctions.isLightMode();

  const meals = useSelector(state => state.mealEntries);

  let dateString = new Date().toLocaleDateString('en-NZ');

  let mealsToday = [];

  if(meals.hasOwnProperty(dateString)) {
    mealsToday = meals[dateString];
  }

  const macroTargets = useSelector(state => state.macroTargets);

  let targetToday;

  if (macroTargets.hasOwnProperty(dateString)) {
    targetToday = macroTargets[dateString] ?? new NutritionInfo(2250, 168.75, 50, 281.25);
  } else {
    targetToday = macroTargets['default'] ?? new NutritionInfo(2250, 168.75, 50, 281.25);
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalCarbs = 0;

  mealsToday.forEach(entry => {
    let effectiveServings = entry.effectiveServings;
    let nutritionInfo = entry.mealInfo.nutritionInfo;

    totalCalories += effectiveServings * nutritionInfo.calories;
    totalProtein += effectiveServings * nutritionInfo.protein;
    totalFats += effectiveServings * nutritionInfo.fats;
    totalCarbs += effectiveServings * nutritionInfo.carbs;
  })

  let missingCalories = targetToday.calories - totalCalories;
  let otherCalories = totalCalories - HelperFunctions.calculateCalories(totalProtein, totalFats, totalCarbs);

  const data = [
    {x: 'Protein', y: totalProtein * 4}, 
    {x: 'Fats', y: totalFats * 9}, 
    {x:'Carbs', y: totalCarbs * 4}, 
    {x: 'Other', y: otherCalories}, 
  ];

  if (missingCalories >= 0) {
    data.push({x: 'Missing', y: missingCalories})
  }

  function ProgressBar(props) {
    return (
      <View style={{width: '100%'}}>
        <Text style={isLightMode? styles.macroTitle_light : styles.macroTitle_dark}>{props.title}</Text>
        <Progress.Bar
          animated
          width={null}
          height={10}
          borderRadius={100}
          color={props.color}
          progress={props.progress}
        />
      </View>
    )
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDateForDailyMacros(new Date()));
  }, [])

  return (
    <TouchableOpacity onPress={() => { props.openMoreInfoScreen() }} style={isLightMode? styles.card_light : styles.card_dark}>
      <Text style={isLightMode? styles.h3_light : styles.h3_dark}>Daily Macros</Text>
      <Text style={{color: isLightMode? '#515151' : '#aaa', fontSize: 16, marginBottom: 10}}>Nutrition</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
      }}>
        <View style={{flex: 1}}>
          <VictoryPie
            style={{
              data: {
                stroke: 'transparent'
              }
            }}
            animate={true}
            theme={VictoryTheme.material}
            innerRadius={48}
            radius={60}
            padAngle={0.5}
            width={130}
            height={130}
            labels={() => null}
            data={data}
            colorScale={[PROTEIN_COLOR, FATS_COLOR, CARBS_COLOR, OTHER_COLOR, MISSING_COLOR]}
          />
        </View>
        <View style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: 5
          }}
        >
          <ProgressBar title="Protein" color={PROTEIN_COLOR} progress={totalProtein / targetToday.protein}/>
          <ProgressBar title="Fats" color={FATS_COLOR} progress={totalFats / targetToday.fats}/>
          <ProgressBar title="Carbs" color={CARBS_COLOR} progress={totalCarbs / targetToday.carbs}/>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
  },

  macroTitle_light: {
    color: "#515151",
    fontSize: 14,
    fontWeight: '500'
  },

  macroTitle_dark: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: '500'
  },

  card_light: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    marginBottom: 14
  },

  card_dark: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    marginBottom: 14
  },

  h1_light: {
    fontSize: 32,
    marginBottom: 25,
    fontWeight: 'bold'
  },

  h2_light: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold'
  },

  h3_light: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold'
  },

  h1_dark: {
    fontSize: 32,
    marginBottom: 25,
    fontWeight: 'bold',
    color: 'white'
  },

  h2_dark: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold',
    color: 'white'
  },

  h3_dark: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: 'white'
  }
});