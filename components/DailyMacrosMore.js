import { Animated, Button, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { VictoryLabel, VictoryPie, VictoryTheme } from "victory-native";
import * as Progress from 'react-native-progress';
import HelperFunctions from "../classes/HelperFunctions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RectButton, ScrollView, Swipeable } from "react-native-gesture-handler";
import { PROTEIN_COLOR, FATS_COLOR, CARBS_COLOR, OTHER_COLOR, MISSING_COLOR } from "./widgets/DailyMacros";
import { setDateForDailyMacros, setMeals } from "../redux/actions";
import structuredClone from "realistic-structured-clone"
import Svg from "react-native-svg";
import { useCallback, useEffect, useState } from "react";
import NutritionInfo from "../classes/NutritionInfo";
import { DatePickerModal } from 'react-native-paper-dates';

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here 
  // is better than directly setting `setValue(value + 1)`
}

export default function DailyMacrosMore(props) {

  const forceUpdate = useForceUpdate();

  const isLightMode = HelperFunctions.isLightMode();

  const insets = useSafeAreaInsets();

  const mealEntries = useSelector(state => state.mealEntries);

  const dispatch = useDispatch();

  function ProgressBar(props) {
    return (
      <View style={{width: '100%'}}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
          <Text style={isLightMode? styles.macroTitle_light : styles.macroTitle_dark}>{props.title}</Text>
          <Text style={isLightMode? styles.macroValues_light : styles.macroValues_dark}>{Math.round(props.numerator)}/{Math.round(props.denominator)}</Text>
        </View>
        <Progress.Bar
          animated={true}
          width={null}
          height={15}
          borderRadius={100}
          color={props.color}
          progress={(props.numerator / props.denominator) ?? 0}
        />
      </View>
    )
  }

  const [calendarVisible, setCalendarVisible] = useState(false);

  const onDismiss = useCallback(() => {
    setCalendarVisible(false)
  }, [setCalendarVisible])

  const onConfirm = useCallback(
    (params) => {
      setCalendarVisible(false);
      dispatch(setDateForDailyMacros(params.date));
      forceUpdate();
    },
    [setCalendarVisible, dispatch]
  );

  const date = new Date(useSelector(state => state.dateForDailyMacros)?? new Date());

  let mealsOnDate = [];

  if(mealEntries.hasOwnProperty(date.toLocaleDateString('en-NZ'))) {
    mealsOnDate = mealEntries[date.toLocaleDateString('en-NZ')];
  }

  const macroTargets = useSelector(state => state.macroTargets);
  let targetToday;

  if (macroTargets.hasOwnProperty(date.toLocaleDateString('en-NZ'))) {
    targetToday = macroTargets[date.toLocaleDateString('en-NZ')] ?? new NutritionInfo(2250, 168.75, 50, 281.25);
  } else {
    targetToday = macroTargets['default'] ?? new NutritionInfo(2250, 168.75, 50, 281.25);
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalCarbs = 0;

  mealsOnDate.forEach(entry => {
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
    {x: 'Protein', y: (totalProtein * 4) ?? 0}, 
    {x: 'Fats', y: (totalFats * 9) ?? 0}, 
    {x:'Carbs', y: (totalCarbs * 4) ?? 0}, 
    {x: 'Other', y: (otherCalories) ?? 0}, 
    {x: 'Missing', y: missingCalories >= 0 ? missingCalories : 0}
  ];

  function incrementDate(increment) {
    let _date = date;
    _date.setDate(date.getDate() + increment);
    dispatch(setDateForDailyMacros(_date))
    
    forceUpdate();
  }

  return (
    <View style={styles.container}>
      <DatePickerModal
        mode="single"
        visible={calendarVisible}
        onDismiss={onDismiss}
        date={date}
        onConfirm={onConfirm}
      />
      <TouchableWithoutFeedback onPress={() => { props.closeModal() }}>
        <View style={{
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(0,0,0,0.6)',
          position: 'absolute'
        }}></View>
      </TouchableWithoutFeedback>
      <View style={[isLightMode? styles.card_light : styles.card_dark, {
        marginTop: insets.top + 10,
        marginLeft: insets.left,
        marginRight: insets.right,
        marginBottom: insets.bottom,
        maxHeight: Dimensions.get('window').height - insets.top - 10 - insets.bottom - 30
      }]}>
        <View style={styles.headerContainer}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={isLightMode? styles.xmarkButton_light : styles.xmarkButton_dark} onPress={props.closeModal}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" size={20} color={isLightMode? "black" : "white"}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={isLightMode? styles.title_light : styles.title_dark}>Daily Macros</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.targetsButton_light} onPress={() => {
              props.navigation.navigate("Macro Targets", {
                openModal: () => { props.openModal(); }
              });
              props.closeModal();
            }}>
              <FontAwesomeIcon icon="fa-solid fa-bullseye" size={20} color="white"/>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView 
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 15,
          }}
          style={{
          maxHeight: Dimensions.get('window').height - insets.top - insets.bottom - 50
          }}
        >
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
            height: 35,
          }}>
            <View style={{flex: 1}}>
              <View style={{
                flex: 1,
                padding: 3,
                paddingHorizontal: 10
              }}>
                <TouchableOpacity
                  onPress={() => { incrementDate(-1) }}
                  style={{
                  flex: 1,
                  backgroundColor: isLightMode? '#919191' : '#919191',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FontAwesomeIcon color="white" icon="fa-solid fa-arrow-left-long" size={20}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => {setCalendarVisible(true)}}>
                <Text style={{
                  color: isLightMode? "black" : "white",
                  fontWeight: '500',
                  fontSize: 16
                }}>{date.toLocaleDateString('en-NZ') === new Date().toLocaleDateString('en-NZ')? "Today" : date.toLocaleDateString('en-NZ')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, paddingHorizontal: 5}}>
              <View style={{
                flex: 1,
                padding: 3,
                paddingHorizontal: 10
              }}>
                <TouchableOpacity 
                  onPress={() => { incrementDate(1) }}
                  style={{
                  flex: 1,
                  backgroundColor: isLightMode? '#919191' : '#919191',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FontAwesomeIcon color="white" icon="fa-solid fa-arrow-right-long" size={20}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Svg style={{
            height: 250,
            width: '100%'
          }}>
            <VictoryPie
              style={{
                data: {
                  stroke: 'transparent'
                }
              }}
              animate={{easing: 'exp'}}
              theme={VictoryTheme.material}
              innerRadius={Dimensions.get('window').width * 0.25}
              radius={Dimensions.get('window').width * 0.28}
              padAngle={0.5}
              width={Dimensions.get('window').width * 0.8}
              height={Dimensions.get('window').width * 0.66}
              data={data}
              labels={({datum}) => null}
              colorScale={[PROTEIN_COLOR, FATS_COLOR, CARBS_COLOR, OTHER_COLOR, MISSING_COLOR]}
            />
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              style={{ fontSize: 30, fill: isLightMode? 'black' : 'white', fontWeight: '600', lineHeight: 40 }}
              x={Dimensions.get('window').width * 0.4} y={Dimensions.get('window').width * 0.325}
              text={totalCalories}
              />
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              style={{ fontSize: 12, fill: isLightMode? '#515151' : '#aaa', fontWeight: '600', lineHeight: 40 }}
              x={Dimensions.get('window').width * 0.4} y={Dimensions.get('window').width * 0.385}
              text={`/${targetToday.calories}`}
              />
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              style={{ fontSize: 16, fill: isLightMode? 'black' : 'white', fontWeight: '400', lineHeight: 40 }}
              x={Dimensions.get('window').width * 0.4} y={Dimensions.get('window').width * 0.265}
              text="cal"
              />
          </Svg>
          <View style={{marginBottom: 10}}>
            <ProgressBar title="Protein" color={PROTEIN_COLOR} numerator={totalProtein} denominator={targetToday.protein}/>
            <ProgressBar title="Fats" color={FATS_COLOR} numerator={totalFats} denominator={targetToday.fats}/>
            <ProgressBar title="Carbs" color={CARBS_COLOR} numerator={totalCarbs} denominator={targetToday.carbs}/>
          </View>

          <Text style={isLightMode? styles.subheading_light : styles.subheading_dark}>Meals</Text>
          <View style={{
            marginTop: -10,
            marginBottom: 12
          }}>
            <Button
              title="ADD MEAL"
              onPress={() => { props.navigation.navigate("Add Meal", {
                openModal: () => { props.openModal(); }
              }); props.closeModal() }}
            />
          </View>
          {
            mealsOnDate.map((entry, i) => {
              let rowRef;

              const renderRightAction = (text, color, x, progress, callback) => {
                const pressHandler = () => {
                  rowRef.close();
                  callback();
                };
                return (
                  <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
                    <RectButton
                      style={[styles.rightAction, { backgroundColor: color }]}
                      onPress={pressHandler}>
                      <Text style={styles.actionText}>{text}</Text>
                    </RectButton>
                  </Animated.View>
                );
              };

              const renderRightActions = progress => (
                <View style={{ width: 192, flexDirection: 'row' }}>
                  {renderRightAction('Edit', '#ffab00', 128, progress, () => {
                    props.navigation.navigate("Edit Meal Confirm", {
                      mealEntry: entry,
                      mode: 'edit',
                      openModal: () => { props.openModal(); },
                      onConfirmSelection: mealEntry => {
                        let allMealEntries = structuredClone(mealEntries);

                        allMealEntries[date.toLocaleDateString('en-NZ')][i] = mealEntry;

                        dispatch(setMeals(allMealEntries));
                      }
                    });
                    props.closeModal();
                  })}
                  {renderRightAction('Delete', '#dd2c00', 64, progress, () => {
                    let allMealEntries = structuredClone(mealEntries);

                    allMealEntries[date.toLocaleDateString('en-NZ')].splice(i, 1);

                    dispatch(setMeals(allMealEntries));
                  })}
                </View>
              );

              const updateRef = ref => {
                rowRef = ref;
              }

              return (
                <View key={entry.id} style={{
                  marginBottom: 8
                }}>
                  <Swipeable 
                    renderRightActions={renderRightActions}
                    ref={updateRef}
                    friction={2}
                  >
                    <View style={isLightMode? styles.mealCard_light : styles.mealCard_dark}>
                      <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Text style={[{fontWeight: '500'}, isLightMode? null : {color: 'white'} ]}>{entry.mealInfo.description}</Text>
                        <Text style={[{fontWeight: 'bold'}, isLightMode? null : {color: 'white'} ]}>{entry.effectiveServings * entry.mealInfo.nutritionInfo.calories}</Text>
                      </View>
                      <Text style={{
                        color: isLightMode? '#717171' : '#aaa'
                      }}>
                        {entry.mealInfo.brandName === ""? "" : (entry.mealInfo.brandName + ", ")}
                        {parseFloat(entry.servingSize.split(' ')[0]) * entry.numberOfServings} {entry.servingSize.split(' ').filter((v, i) => i >= 1).join(' ')}
                      </Text>
                    </View>
                  </Swipeable>
                </View>
              )
            })
          }
        </ScrollView>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
  },
  
  macroTitle_light: {
    color: "#515151",
    fontSize: 16,
    marginVertical: 5,
    marginTop: 10,
    fontWeight: '700'
  },

  macroTitle_dark: {
    color: "#aaa",
    fontSize: 16,
    marginVertical: 5,
    marginTop: 10,
    fontWeight: '700'
  },

  macroValues_light: {
    color: "#717171",
    fontSize: 12,
    marginBottom: 4
  },
  
  macroValues_dark: {
    color: "#919191",
    fontSize: 12,
    marginBottom: 4
  },

  xmarkButton_light: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 4,
    borderRadius: 8
  },

  xmarkButton_dark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 8,
  },

  targetsButton_light: {
    padding: 6,
    paddingHorizontal: 10,
    backgroundColor: '#58A5F8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },

  title_light: {
    fontWeight: 'bold',
    fontSize: 16
  },

  title_dark: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },

  subheading_light: {
    fontWeight: 'bold',
    marginVertical: 10,
    fontSize: 18
  },

  subheading_dark: {
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 10,
    fontSize: 18
  },

  card_light: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
  },

  card_dark: {
    backgroundColor: '#202020',
    borderRadius: 20,
    width: '90%',
  },

  mealCard_light: {
    borderWidth: 1,
    padding: 10,
    borderColor: '#ddd',
    backgroundColor: 'white'
  },

  mealCard_dark: {
    borderWidth: 1,
    padding: 10,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#222'
  },

  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },

  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});