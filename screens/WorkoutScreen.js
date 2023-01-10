import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Button, Dimensions, Easing, FlatList, I18nManager, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";;
import WorkoutExercise from "../classes/WorkoutExercise";
import WeightAndReps from "../classes/WeightAndReps";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import RestTimer from "../components/RestTimer";
import Workout from "../classes/Workout";
import HelperFunctions from "../classes/HelperFunctions";
import { withNavigation } from "react-navigation";
import Constants from 'expo-constants';
import structuredClone from 'realistic-structured-clone';


const RESTTIMERBUTTONWIDTH = 60;

class WorkoutScreen extends React.Component {
  constructor(props) {
    super(props);

    let workoutExercises = [];
    let template = structuredClone(props.route.params.template);

    if (template != null && template != undefined) {
      for(let workoutExercise of template.workoutExercises) {
        workoutExercises.push(new WorkoutExercise(workoutExercise.exercise, workoutExercise.sets))
      }
    }

    this.state = {
      elapsedTime: 0,
      workoutName: props.route.params.template.name,
      workoutExercises: workoutExercises,
      restTimerOpen: false,
      notes: "",
      restTimerInfo: {},
    }

    this.timerAnim = new Animated.Value(RESTTIMERBUTTONWIDTH);
    this.timerAnim.addListener(({value}) => this._value = value);

    this.startTimer();
  }

  isTemplateMode() {
    return this.props.route.params.mode === 'template' || this.props.route.params.mode === 'editTemplate';
  }

  isEditTemplateMode() {
    return this.props.route.params.mode === 'editTemplate';
  }

  isEditWorkoutMode() {
    return this.props.route.params.mode === 'editWorkout';
  }

  startTimer() {
    setInterval(() => {
      this.setState({
        elapsedTime: Date.now() - this.props.route.params.startTime
      });
    }, 1000)
  }

  formattedElapsedTime() {
    let seconds = this.state.elapsedTime;

    seconds = Math.floor(seconds / 1000);

    return this.formatSeconds(seconds, 1);
  }

  formatSeconds(seconds, minutesPadding = 2) {
    if (seconds < 0)
      return "0:00";

    let dateObj = new Date(seconds * 1000);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    hoursString = hours.toString();
    minutesString = minutes.toString().padStart(minutesPadding, '0');
    secondsString = seconds.toString().padStart(2, '0');
  
    timeString = (hours === 0? "" : hoursString + ':' )
        + minutesString
        + ':' + secondsString;

    return timeString;
  }

  checkForEmptyExercises() {
    this.setState(prev => ({
      workoutExercises: prev.workoutExercises.filter(val => val.sets.length >= 1)
    }))
  }

  finishWorkoutButton() {
    if (this.state.workoutExercises.length === 0) {
      Alert.alert(this.isTemplateMode()? "Please select at least one exercise" 
        : "Please complete at least one exercise");
      return;
    }

    let completed = true;
    let allFilledOut = true;

    for(let workoutExercise of this.state.workoutExercises) {
      for(let weightsAndReps of workoutExercise.sets) {
        if (!weightsAndReps.completed) 
          completed = false;
        
        if(weightsAndReps.weight == '' 
          || weightsAndReps.weight == -1337
          || weightsAndReps.reps == ''
          || weightsAndReps.reps == -1337)
          allFilledOut = false;
      }
    }

    if (!completed && !this.isTemplateMode() && !this.isEditWorkoutMode()) {
      Alert.alert("Please complete all your sets");
      return;
    }

    if(this.isEditWorkoutMode() && !allFilledOut) {
      Alert.alert("Please fill out all the blanks");
      return;
    }

    Alert.alert(
      this.isTemplateMode()? (this.isEditTemplateMode()? 'Finish editing template?' : 'Finish creating template?') 
      : this.isEditWorkoutMode()? 'Finish changes?' : 'Finish workout?',
      '',
      [
        { text: "Cancel", style: 'cancel', onPress: () => {} },
        {
          text: 'Finish',
          style: 'default',
          onPress: () => {
            this.finishWorkout();
          },
        },
      ]
    );
  }

  finishWorkout() {
    let workout = new Workout(this.state.workoutName, this.state.notes, this.state.workoutExercises, this.isEditWorkoutMode()? new Date(this.props.route.params.originalDate) : Date.now())
    this.props.route.params.finishWorkout(workout);
    if (!this.isTemplateMode() && !this.isEditWorkoutMode()) {
      this.props.navigation.navigate("Finished Workout", {
        workout: workout
      });
    } else {
      this.props.navigation.goBack();
    }
  }

  renderItem({item}) {
    return (
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseTitle}>{item.exercise.name}</Text>
        <View style={styles.cardRow}>
          <View style={styles.col1}></View>
          <View style={styles.col2}>
            <Text style={styles.cardHeader}>kg</Text>
          </View>
          <View style={styles.col3}>
            <Text style={styles.cardHeader}>Reps</Text>
          </View>
          <View style={styles.col4}></View>
        </View>
        {
          item.sets.map((val, i, arr) => {
            
            const renderRightAction = (text, color, x, progress) => {
              const pressHandler = () => {
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
              <View style={{ width: Dimensions.get('window').width, flexDirection: I18nManager.isRTL? 'row-reverse' : 'row' }}>
                {renderRightAction('Delete', '#dd2c00', 64, progress)}
              </View>
            );

            return (
              <Swipeable 
                key={val.id}
                onSwipeableOpen={() => {
                  item.sets.splice(i, 1);
                  this.checkForEmptyExercises();
                  this.forceUpdate();
                }}
                renderRightActions={renderRightActions}
              >
                <View style={[styles.cardRow, (val.completed && !this.isEditWorkoutMode())? { backgroundColor: 'rgb(130, 255, 130)' } : null ]}>
                  <View style={styles.col1}>
                    <Text style={styles.setNoText}>{i + 1}</Text>
                  </View>
                  <View style={[styles.col2, {paddingHorizontal: 5}]}>
                    {
                      this.isTemplateMode()? null :
                      <TextInput 
                        style={[styles.weightAndRepsInput, (val.completed && !this.isEditWorkoutMode())? {backgroundColor: 'transparent'} : null ]}
                        keyboardType='numeric'
                        value={val.weight === -1337? '' : val.weight.toString()}
                        onChangeText={text => {
                          val.weight = text.replace(/[^0-9\.]/g, '');
                          this.forceUpdate();
                        }}
                        onBlur={() => {
                          val.weight = parseFloat(val.weight);
                          if (isNaN(val.weight)) {
                            val.weight = '';
                          }
                          this.forceUpdate();
                        }}
                      />
                    }
                  </View>
                  <View style={[styles.col3, {paddingHorizontal: 5}]}>
                    {
                      this.isTemplateMode() ? null :
                      <TextInput 
                        style={[styles.weightAndRepsInput, (val.completed && !this.isEditWorkoutMode())? {backgroundColor: 'transparent'} : null ]}
                        keyboardType='number-pad'
                        value={val.reps === -1337? ''  : val.reps.toString()}
                        onChangeText={text => {
                          val.reps = text.replace(/[^0-9]/g, '');
                          this.forceUpdate();
                        }}
                        onBlur={() => {
                          val.reps = parseInt(val.reps);
                          if (isNaN(val.reps)) {
                            val.reps = '';
                          }
                          this.forceUpdate();
                        }}
                      />
                    }
                    
                  </View>
                  <TouchableOpacity 
                    style={styles.col4} 
                    onPress={() => { 
                      if(val.completed) {
                        val.completed = false;
                        this.forceUpdate();
                        return;
                      }

                      if (val.weight == '' || val.reps == '' || val.weight == -1337 || val.reps == -1337)
                        return;

                      val.completed = true;

                      this.forceUpdate();
                    }}
                  >
                    {
                      this.isTemplateMode() || this.isEditWorkoutMode() ? null :
                      <FontAwesomeIcon 
                        icon='fa-solid fa-square-check' 
                        size={35} 
                        color={(val.completed && !this.isEditWorkoutMode())? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.1)"}/>
                    }
                  </TouchableOpacity>
                </View>
              </Swipeable>
            );
          })
        }
        <View style={{
          paddingHorizontal: 20,
          paddingVertical: 10
        }}>
          <Button
            title="ADD SET"
            onPress={() => {
              item.sets.push(new WeightAndReps());
              this.forceUpdate();
            }}
          />
        </View>
      </View>
    )
  }

  openRestTimer() {
    this.setState({
      restTimerOpen: true
    });
  }

  closeRestTimer() {
    this.setState({
      restTimerOpen: false
    });
  }

  cancelWorkoutButton() {
    Alert.alert(
      this.isTemplateMode() ? (this.isEditTemplateMode()? 'Delete Template?' : 'Discard Template?') 
      : this.isEditWorkoutMode()? 'Delete Workout?' : 'Cancel Workout?',
      'This cannot be undone. Continue?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {} },
        {
          text: this.isEditTemplateMode()? 'Delete' : (this.isEditWorkoutMode()? 'Delete' : 'Exit'),
          style: 'destructive',
          onPress: () => {
            if (this.isEditTemplateMode()) {
              this.props.route.params.deleteTemplate();
            } else if (this.isEditWorkoutMode()) {//DELETE WORKOUT
              this.props.route.params.deleteWorkout();
              this.props.navigation.goBack();
            } else {
              this.props.navigation.goBack();
            }
          },
        },
      ]
    );
  }

  cancelEditTemplateButton() {
    Alert.alert(
      'Discard Changes?',
      'This cannot be undone. Continue?',
      [
        { text: "Go back", style: 'cancel', onPress: () => {} },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            this.props.navigation.goBack();
          },
        },
      ]
    );
  }

  startRestTimer(duration) {

    this.timerAnim.setValue(RESTTIMERBUTTONWIDTH);

    this.setState(prev => ({
      restTimerInfo: {
        ...prev.restTimerInfo,
        restDuration: duration,
        restTimerRunning: true,
        restTimerStartDate: Date.now(),
        restCountdown: duration,
        onCompleteActivated: false
      }
    }));

    this.countdownInterval = setInterval(() => {

      this.setState(prev => {
        let restCountdown = prev.restTimerInfo.restDuration - (Date.now() - prev.restTimerInfo.restTimerStartDate) / 1000;

        if(restCountdown <= 0 && !prev.restTimerInfo.onCompleteActivated) {
          this.onCountdownComplete();
          return;
        }

        return {
          restTimerInfo: {
            ...prev.restTimerInfo,
            restCountdown: restCountdown
          }
        }
      });
    }, 100);

    Animated.timing(
      this.timerAnim,
      {
        toValue: 0,
        duration: duration * 1000,
        useNativeDriver: false,
      }
    ).start();
  }

  incrementRestTimer(increment) {
    this.setState(prev => ({
      restTimerInfo: {
        ...prev.restTimerInfo,
        restDuration: Math.max(prev.restTimerInfo.restDuration + increment, 0),
        restCountdown: Math.max(prev.restTimerInfo.restCountdown + increment, 0)
      }
    }), () => {
      this.timerAnim.setValue(RESTTIMERBUTTONWIDTH * (this.state.restTimerInfo.restCountdown / this.state.restTimerInfo.restDuration));
      Animated.timing(
        this.timerAnim,
        {
          toValue: 0,
          duration: this.state.restTimerInfo.restCountdown * 1000,
          useNativeDriver: false,
        }
      ).start();
    });
  }

  skipRestTimer() {
    this.setState(prev => ({
      restTimerInfo: {
        ...prev.restTimerInfo,
        restTimerRunning: false,
        restCountdown: prev.restTimerInfo.restDuration
      }
    }));

    clearInterval(this.countdownInterval);

    this.closeRestTimer();
  }

  onCountdownComplete() {

    clearInterval(this.countdownInterval);

    Alert.alert("Rest Timer Up");

    console.log("REST TIMER UP");

    this.setState(prev => {
      if (prev.restTimerInfo.onCompleteActivated)
        return { restTimerInfo: {...prev.restTimerInfo} }

      return {
        restTimerOpen: false,
        restTimerInfo: {
          ...prev.restTimerInfo,
          restTimerRunning: false,
          restDuration: 60,
          restCountdown: 60,
          onCompleteActivated: true
        }
      }
    });
  }

  cancelEditWorkoutButton() {
    Alert.alert(
      'Discard changes?',
      'This cannot be undone. Continue?',
      [
        { text: "Cancel", style: 'cancel', onPress: () => {} },
        {
          text: 'Continue',
          onPress: () => {
            this.props.navigation.goBack();
          },
        },
      ]
    );
  }

  renderCancelButton() {
    return (
      <TouchableOpacity 
        style={styles.restTimerButtonContainer}
        onPress={() => { this.cancelEditWorkoutButton() } }
      >
        <FontAwesomeIcon icon="fa-solid fa-xmark" size={18}/>
      </TouchableOpacity>
    )
  }

  renderCancelEditTemplateButton() {
    return (
      <TouchableOpacity 
        style={[styles.restTimerButtonContainer, { marginLeft: -113 } ]}
        onPress={() => {this.cancelEditTemplateButton()} }
      >
        <FontAwesomeIcon icon="fa-solid fa-xmark" size={18}/>
      </TouchableOpacity>
    )
  }

  render() {

    const DATA = this.state.workoutExercises.map((val, i, arr) => ({
      exercise: val.exercise,
      sets: val.sets,
      id: val.id
    }));

    return (
      <View
        style={{
          flex: 1,
          paddingTop: Constants.statusBarHeight
          //paddingLeft: insets.left,
          //paddingRight: insets.right,
        }}
      >
        <Modal
          visible={this.state.restTimerOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setRestTimerOpen(!restTimerOpen);
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <RestTimer 
            closeModal={() => { this.closeRestTimer(); }}
            startRestTimer={duration => { this.startRestTimer(duration) }}
            restDuration={this.state.restTimerInfo.restDuration}
            restCountdown={this.state.restTimerInfo.restCountdown}
            restTimerRunning={this.state.restTimerInfo.restTimerRunning}
            formatSeconds={seconds => { return this.formatSeconds(seconds, 1) }}
            incrementRestTimer={increment => { this.incrementRestTimer(increment) }}
            skipRestTimer={() => { this.skipRestTimer() }}
          />
        </Modal>
        <View style={styles.fixedHeader}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {
              (this.isTemplateMode() || this.isEditWorkoutMode())? (
                !this.isEditTemplateMode()? (!this.isEditWorkoutMode()? null :
                  this.renderCancelButton()
                ) :
                  this.renderCancelEditTemplateButton()
              ) : 
              <TouchableOpacity 
                style={[styles.restTimerButtonContainer, 
                this.state.restTimerInfo.restTimerRunning? { width: RESTTIMERBUTTONWIDTH } : null]} 
                onPress={() => { this.openRestTimer() }}>
                <Animated.View style={this.state.restTimerInfo.restTimerRunning? {
                  width: this.timerAnim._value,
                  height: '200%',
                  position: 'absolute',
                  backgroundColor: '#58A5F8'
                } : null}></Animated.View>
                {
                  this.state.restTimerInfo.restTimerRunning? 
                  <View>
                    <Text 
                      style={{
                        fontVariant: ['tabular-nums'], 
                        textAlign: 'center', 
                        color: 'white', 
                        fontWeight: 'bold',
                      }}
                    >{this.formatSeconds(this.state.restTimerInfo.restCountdown, 1)}</Text>
                  </View>
                  : <FontAwesomeIcon icon="fa-solid fa-stopwatch-20" size={22}/>
                }
              </TouchableOpacity>
            }
            
          </View>
          <View style={{flex: this.isTemplateMode()? 0 : 3, justifyContent: 'center', alignItems: 'center'}}>
            {
              this.isTemplateMode() || this.isEditWorkoutMode()? null :
              <Text style={styles.headerTimeText}>{this.formattedElapsedTime()}</Text>
            }
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={[styles.finishButton, this.isTemplateMode()? (this.isEditTemplateMode()? {marginLeft: 32.5} : { marginRight: -110 }) : 
              (this.isEditWorkoutMode()? { marginLeft: -80 } : null) ]} onPress={() => { this.finishWorkoutButton() }}>
              <Text style={styles.finishText}>{(this.isEditTemplateMode() || this.isEditWorkoutMode())? "Finish Editing" : "Finish"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <TextInput 
                style={styles.title} 
                defaultValue="New Workout"
                value={this.state.workoutName}
                onChangeText={text => {
                  this.setState({
                    workoutName: text
                  });
                }}
              />
              {
                this.isTemplateMode() || this.isEditWorkoutMode() ? null :
                <>
                  <Text style={styles.timeText}>{this.formattedElapsedTime()}</Text>
                  <TextInput style={styles.notes} value={this.state.notes} placeholder="Notes" multiline={true}
                    onChangeText={text => {
                      this.setState({
                        notes: text
                      })
                    }}
                  />
                </>
              }
            </View>
          }
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <View style={{ marginBottom: 10 }}>
                <Button
                  title="ADD EXERCISE"
                  onPress={() => { this.props.navigation.navigate("Add Exercise", {
                      onExerciseSelected: (exercise) => {
                        this.setState(prev => ({
                          workoutExercises: [...prev.workoutExercises, new WorkoutExercise(exercise, 1)]
                        }));
                      },
                      navigateTo: "_PREVIOUSSCREEN",
                      accountForStatusBarHeight: false,
                    }) 
                  }}
                />
              </View>
              <View>
                <Button
                  title={this.isTemplateMode()? (this.isEditTemplateMode()? "DELETE TEMPLATE" : "DISCARD TEMPLATE") 
                  : this.isEditWorkoutMode()? "DELETE WORKOUT" : "CANCEL WORKOUT"}
                  color="red"
                  onPress={() => { this.cancelWorkoutButton() }}
                />
              </View>
            </View>
          }
          contentContainerStyle={styles.contentContainer}
          style={{flex: 1}}
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={(item) => { return this.renderItem(item)}}
        />
      </View>

    );

  }
}

export default withNavigation(WorkoutScreen);

const styles = StyleSheet.create({
  fixedHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: 50 + 9999,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: -9999,
    paddingTop: 9999

    //is this bad practice?
  },

  restTimerButtonContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 8,
    overflow: 'hidden',
  },

  finishButton: {
    backgroundColor: "#65CA79",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: -30,
  },

  finishText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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

  headerContainer: {
    padding: 20,
    width: Dimensions.get('window').width
  },

  setNoText: {
    fontSize: 14
  },

  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },

  exerciseCard: {
    width: Dimensions.get('window').width,
    marginBottom: 20
  },

  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    borderColor: 'red',
    paddingVertical: 3,
    backgroundColor: '#f1f1f1'
    //TODO: GET THE ACTUAL RIGHT COLOUR
  },

  cardHeader: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },

  weightAndRepsInput:{
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 5,
    fontSize: 20,
    borderRadius: 8,
    textAlign: 'center'
  },

  col1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  col2: {
    flex: 3,
    justifyContent: 'center'
  },

  col3: {
    flex: 3,
    justifyContent: 'center'
  },

  col4: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  exerciseTitle: {
    color: '#58A5F8',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginVertical: 10
  },

  notes: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    fontSize: 16,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  headerTimeText: {
    color: '#717171',
    fontSize: 16,
  },

  timeText: {
    color: '#717171',
    fontSize: 16,
    marginBottom: 20,
    fontVariant: ['tabular-nums']
  },

  footerContainer: {
    padding: 20,
    width: Dimensions.get('window').width
  },

  
  destructiveButton: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 145,
    marginLeft: -20,
    borderRadius: 10,
  }
});