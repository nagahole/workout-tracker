import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import HelperFunctions from "../classes/HelperFunctions";
import WorkoutsPerWeek from "../components/widgets/WorkoutsPerWeek";

export default function ProfileScreen({route, navigation}) {

  const insets = useSafeAreaInsets();

  const workouts = useSelector(state => state.workouts);

  const isLightMode = HelperFunctions.isLightMode();

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }, isLightMode? null : { backgroundColor: "#202020" } ]}>
      <ScrollView style={styles.scrollview}>
        <Text style={isLightMode? styles.h1_light : styles.h1_dark}>Profile</Text>
        <View style={{
          marginBottom: 20
        }}>
          <Text style={{
            color: isLightMode? "#515151" : "#aaa",
            fontSize: 18
          }}>{workouts.length} workouts</Text>
        </View>
        <Text style={isLightMode? styles.h3_light : styles.h3_dark}>Dashboard</Text>
        
        <WorkoutsPerWeek/>
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  scrollview: {
    width: Dimensions.get('window').width,
    padding: 20
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
    marginBottom: 18,
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
    color: 'white',
  },

  h3_dark: {
    fontSize: 16,
    marginBottom: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});