import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import HelperFunctions from "../../classes/HelperFunctions";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryScatter, VictoryAxis, VictoryLabel } from "victory-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function ChartsScreen({route, navigation}) {

  const isLightMode = HelperFunctions.isLightMode();

  const [data,] = useState(function () {
    let obj = HelperFunctions.getOneRepMaxFromEachWorkout(route.params.exercise);
    let res = [];

    for (const key in obj) {
      let oneRepMax = obj[key]
      let date = new Date(parseInt(key));

      res.push({x: date, y: oneRepMax});
    }

    console.log(res);

    return res;

  }());

  const [yMax, ] = useState(function() {

    let res = -1;

    data.forEach(obj => {
      res = Math.max(obj.y, res);
    });

    return res * 1.3;

  }());

  const [timeRange, ] = useState(function() {
    if (data.length <= 0)
      return;

    let timeDifferenceInMilliseconds = Math.abs(data[0].x.getTime() - data[data.length - 1].x.getTime());

    return timeDifferenceInMilliseconds;

  }())

  return (
    <View style={[styles.container, isLightMode? null : {backgroundColor: '#111'} ]}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
      >
        {
          data.length <= 1? 
          <View style={styles.noteView}>
            <View style={{
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1,
              marginBottom: 5
              }}
            >
              <FontAwesomeIcon style={{color: "#58A5F8"}} size={24} icon="fa-solid fa-circle-info" />
            </View>
            <Text style={isLightMode? styles.noteText_light : styles.noteText_dark }>Please complete this exercise at least twice across two different workouts to see your chart</Text>
          </View>
        :
          <View>
            <View style={styles.card}>
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 22,
                marginBottom: 30
              }}>1rm over time</Text>
              <VictoryChart
                theme={VictoryTheme.material}
                domain={{y: [0, yMax]}}
                width={Dimensions.get('window').width - 40}
                height={Dimensions.get('window').width * 0.7}
                padding={{ top: 10, bottom: 50, left: 40, right: 30 }}
              >
                <VictoryAxis
                  dependentAxis
                  style={{
                    grid: { stroke: "lightgrey" },
                    tickLabels: {
                      fontWeight: 300,
                      letterSpacing: "1px",
                      stroke: "black",
                      fontSize: 12,
                      marginBlock: 50,
                      angle: -60,
                      fill: isLightMode? '#717171' : '#aaa',
                    }
                  }}
                />
                <VictoryAxis
                  tickCount={2}
                  style={{
                    grid: { stroke: "lightgrey" },
                    tickLabels: {
                      fontWeight: 300,
                      letterSpacing: "1px",
                      stroke: "black",
                      fontSize: 12,
                      marginBlock: 50,
                      fill: isLightMode? '#717171' : '#aaa'
                    }
                  }}
                  tickFormat={(tick) => {
                    let date = new Date(tick);

                    if (timeRange < 300000) {// 5 minutes
                      return date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit"
                      });
                    } else if (timeRange < 8.64e+7) {//a day
                      return date.toLocaleTimeString("en-US", {
                        hour: "numeric", 
                        minute: "2-digit"
                      });
                    } 

                    return date.getMonthShortened().toUpperCase() + " " + date.getDate();
                  }}
                />
                <VictoryLine
                  style={{
                    data: { stroke: "#58A5F8" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={data}
                  interpolation="linear"
                />
                <VictoryScatter
                  style={{data: {fill: '#58A5F8'}}}
                  data={data}
                  size={3}
                />
                <VictoryScatter
                  style={{data: {fill: isLightMode? 'white' : 'black'}}}
                  data={data}
                  size={1}
                />
              </VictoryChart>
            </View>
          </View>
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center'
  },

  contentContainer: {
    padding: 20,
  },

  noteView: {
    padding: 15,
    paddingBottom: 20,
    borderWidth: 2,
    borderColor: '#58A5F8',
    borderRadius: 15
  },

  noteText_light: {
    fontSize: 18,
    textAlign: 'center',
    color: "#313131"
  },

  noteText_dark: {
    fontSize: 18,
    textAlign: 'center',
    color: "#aaa"
  }
});