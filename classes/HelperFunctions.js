import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Exercises } from "../data/Exercises";
import Workout from "./Workout";

const DAYSOFTHEWEEK = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

const MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
}

Date.prototype.getDayOfTheWeek = function () {
  return DAYSOFTHEWEEK[this.getDay()];
}

Date.prototype.getMonthShortened = function () {
  return MONTHS[this.getMonth()];
}

Date.prototype.getAMPMTime = function() {
  return this.toLocaleTimeString("en-US", {
    hour: "numeric", 
    minute: "2-digit"
  });
}

const MILLISECONDSINADAY = 86400000;

Date.prototype.getDayRoundedMilliseconds = function() {
  return Math.floor(this.getTime() / MILLISECONDSINADAY);
}

String.prototype.truncate = function(n) {
  return (this.length > n) ? this.slice(0, n-1) + ".." : this;//'&hellip;' : this;
}

class HelperFunctions {

  static getWorkouts = () => useSelector(state => state.workouts );

  static calculateOneRepMax(weightAndReps) {
    let weight = weightAndReps.weight;
    let reps = weightAndReps.reps;

    return weight * (1 + 0.0333 * reps);
  }

  static getOneRepMaxFromEachWorkout(exercise, workouts = this.getWorkouts()) {
    let dayAndSets = {}

    /*

    I should return an array of object with x positions and y positions, 
    with x corresponding to datetime and y corresponding to 1rm


    1. Loop through each workout and append their workoutExercises' sets to a date key 
    2. Loop through each date key and change its value to the number of the greatest one rep max

    */

    workouts.forEach((workout) => {
      //let date = new Date(workout.date).getDayRoundedMilliseconds();
      let date = workout.date;
      let workoutExercises = workout.workoutExercises;

      let oneRepMax = -1;

      for(let workoutExercise of workoutExercises) {
        let _exercise = workoutExercise.exercise;

        if (_exercise.id === exercise.id) {
          let sets = workoutExercise.sets;

          for(let set of sets) {
            let curOneRepMax = this.calculateOneRepMax(set);

            if (curOneRepMax > oneRepMax) {
              oneRepMax = curOneRepMax;
            }
          }
        }
      }

      if(oneRepMax !== -1)
        dayAndSets[date] = oneRepMax;

      /*

      if (oneRepMax === -1)
        return;

      if(dayAndSets.hasOwnProperty(date)) {
        dayAndSets[date] = dayAndSets[date] > oneRepMax? dayAndSets[date] : oneRepMax;
      } else {
        dayAndSets[date] = oneRepMax;
      }

      */
    });

    return dayAndSets;
  }

  static getWorkoutsSortedByDate(workouts) { 

    workouts.sort((a, b) => a.date < b.date);
    return workouts;
  }

  static getTopSets(exercise, topX, workouts = this.getWorkouts()) {
    let res = [];

    for (let workout of workouts) {

      let b = [];

      for (let workoutExercise of workout.workoutExercises) {
        if (workoutExercise.exercise.id === exercise.id) {
          for(let weightAndReps of workoutExercise.sets) 
            b.push({ set: weightAndReps, date: workout.date});
        }
      }

      res.push(...b);
    }

    res.sort((a, b) => this.calculateOneRepMax(a.set) < this.calculateOneRepMax(b.set));

    return res.slice(0, topX);
  }

  static getWorkoutsContainingExercise(exercise, workouts = this.getWorkouts()) {
    let res = [];

    for (let workout of workouts) {

      let b = [];

      for (let workoutExercise of workout.workoutExercises) {
        if (workoutExercise.exercise.id === exercise.id) {
          b.push(workoutExercise);
        }
      }

      res.push(new Workout(workout.name, workout.notes, b, workout.date));
    }

    return res.filter(val => val.workoutExercises.length > 0 );
  }

  static getExercisesSortedAlphabetically(searchText = "") {
    let exercises = [];

    Object.keys(Exercises).forEach(key => {
      exercises.push(Exercises[key]);
    })

    exercises.sort((a, b) => a.name.localeCompare(b.name));

    exercises = exercises.filter(exercise => exercise.name.toLowerCase().includes(searchText.toLowerCase()))

    let dict = {};

    exercises.forEach(exercise => {
      if (exercise.name[0] in dict) {
        dict[exercise.name[0]].push(exercise);
      } else {
        dict[exercise.name[0]] = [exercise];
      }
    });

    return dict;
  }
}

export default HelperFunctions;