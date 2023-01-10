import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import HelperFunctions from "../../classes/HelperFunctions";

export default function RecordsScreen({route, navigation}) {

  const [topSets,] = useState(HelperFunctions.getTopSets(route.params.exercise, 12));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subheading}>PERSONAL RECORDS</Text>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 20
          }}>1RM</Text>
          <Text style={{
            fontSize: 20
          }}>{topSets.length <= 0? "-/-" : Math.round(HelperFunctions.calculateOneRepMax(topSets[0].set)).toLocaleString("en-US")} kg</Text>
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Text style={[{flex: 1, textAlign: 'center'}, styles.subheading]}>POS</Text>
          <Text style={[{flex: 3, textAlign: 'center'}, styles.subheading]}>BEST PERFORMANCE</Text>
          <Text style={[{flex: 2, textAlign: 'center'}, styles.subheading]}>ESTIMATED 1RM</Text>
        </View>
        {
          topSets.map((obj, i) => {

            return (
              <View 
                key={i}
                style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
              }}>
                <Text style={{
                  flex: 1, 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  fontSize: 16
                  }}
                >{i + 1}</Text>
                <View style={{
                  flex: 3,
                  display: 'flex'
                }}>
                  <Text style={{textAlign: 'center', fontSize: 16}}>{`${obj.set.weight} kg (x${obj.set.reps})`}</Text>
                  <Text style={{textAlign: 'center', fontSize: 12, letterSpacing: 1, color: "#919191"}}>{new Date(obj.date).toLocaleDateString('en-NZ')}</Text>
                </View>
                
                <Text style={{flex: 2, textAlign: 'center', fontSize: 16}}>{Math.round(HelperFunctions.calculateOneRepMax(obj.set)).toLocaleString('en-US')} kg</Text>
              </View>
            )
          })
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  contentContainer: {
    padding: 20,
  },

  subheading: {
    color: "#515151",
    paddingVertical: 10
  }
});