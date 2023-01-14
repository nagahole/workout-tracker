import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, Animated, Alert} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import HelperFunctions from "../classes/HelperFunctions";
import { addMeal, addMealInfoToDatabase, addMealOnDate, setMealInfoDatabase } from "../redux/actions";

export default function AddMealScreen({navigation, route}) {

  const isLightMode = HelperFunctions.isLightMode();

  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();

  const MEAL_DATABASE = useSelector(state => state.mealDatabase);

  const mealEntries = useSelector(state => state.mealEntries);

  const dateForDailyMacros = useSelector(state => state.dateForDailyMacros);

  const DATA = MEAL_DATABASE.filter(val => val.description.toLowerCase().includes(searchText.toLowerCase())).map((val, i, arr) => {
    return {
      mealInfo: val,
      index: i,
      id: val.id
    }
  })

  useEffect(() => {

    navigation.addListener('beforeRemove', (e) => {

      route.params.openModal();

    })
  }, [])

  function renderItem({item}) {
    let mealInfo = item.mealInfo;
    let rowRef;

    const renderRightAction = (text, color, x, progress, callBack) => {
      const pressHandler = () => {
        rowRef.close();
        callBack();
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
      <View style={{ width: 192, flexDirection: 'row'}}>
        {renderRightAction('Edit', '#ffab00', 128, progress, () => {
          navigation.navigate("Edit Meal", {
            onMealCreated: mealInfo => {
              let database = [...MEAL_DATABASE];

              for(let i = 0; i < database.length; i++) {
                if (database[i].id === item.id) {
                  //When meals are editted their id turns into the time they updated their new meal. Maybe change this?
                  database[i] = mealInfo;
                }
              }

              dispatch(setMealInfoDatabase(database));
            },
            mealInfo: item.mealInfo,
            mode: "edit"
          });
        })}
        {renderRightAction('Delete', '#dd2c00', 64, progress, () => {
          Alert.alert("Are you sure you want to delete this meal data?", "This cannot be undone. Continue?",
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                let database = [...MEAL_DATABASE];

                database.splice(item.index, 1);

                dispatch(setMealInfoDatabase(database));
              },
              style: 'destructive',
            },
          ])
        })}
      </View>
    );

    const updateRef = ref => {
      rowRef = ref;
      return;
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        ref={updateRef}
      >
        <TouchableOpacity onPress={() => {
          navigation.navigate("Add Meal Confirm", {
            mealInfo: mealInfo,
            onConfirmSelection: mealEntry => {
              dispatch(addMealOnDate(mealEntry, dateForDailyMacros));
            }
          })
        }}
        >
          <View style={isLightMode? styles.card_light : styles.card_dark}>
            <Text style={isLightMode? styles.mealNameText_light : styles.mealNameText_dark}>{mealInfo.description}</Text>
            <Text style={isLightMode? styles.mealInfo_light : styles.mealInfo_dark}>{mealInfo.nutritionInfo.calories} cal, {mealInfo.servingSize}{mealInfo.brandName === ""? "" : `, ${mealInfo.brandName}`}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: isLightMode? 'transparent' : "#222"
    }}>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <TextInput 
              placeholder="Search for a meal / food"
              style={isLightMode? styles.searchBar_light : styles.searchBar_dark}
              onChangeText={text => { setSearchText(text) }}
              placeholderTextColor="#666"
            />
            <View style={{marginVertical: 10}}>
              <Button
                title={"CREATE MEAL / FOOD"}
                onPress={() => {navigation.navigate("Create Meal", {
                  onMealCreated: mealInfo => {
                    dispatch(addMealInfoToDatabase(mealInfo));
                  }
                })}}
              />
            </View>
          </View>
        }

      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar_light: {
    backgroundColor: "rgba(0,0,0,0.07)",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    color: "#818181"
  },

  searchBar_dark: {
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    color: "white",
  },

  card_light: {
    width: '100%',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#eaeaea"
  },

  card_dark: {
    width: '100%',
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#282828"
  },

  mealNameText_light: {
    fontSize: 18,
    fontWeight: '500'
  },

  mealNameText_dark: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500'
  },

  mealInfo_light: {
    color: '#515151'
  },

  mealInfo_dark: {
    color: '#919191'
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