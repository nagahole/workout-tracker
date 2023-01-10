import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import WorkoutsPerWeek from "../components/widgets/WorkoutsPerWeek";

export default function ProfileScreen({route, navigation}) {

  const insets = useSafeAreaInsets();

  const workouts = useSelector(state => state.workouts);

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.h1}>Profile</Text>
        <View style={{
          marginBottom: 20
        }}>
          <Text style={{
            color: "#515151",
            fontSize: 18
          }}>{workouts.length} workouts</Text>
        </View>
        <Text style={styles.h3}>Dashboard</Text>
        
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

  h1: {
    fontSize: 32,
    marginBottom: 25,
    fontWeight: 'bold'
  },

  h2: {
    fontSize: 24,
    marginBottom: 22,
    fontWeight: 'bold'
  },

  h3: {
    fontSize: 16,
    marginBottom: 18,
    fontWeight: 'bold'
  }
});