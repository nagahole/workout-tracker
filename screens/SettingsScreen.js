import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { setTemplates, setWorkouts } from "../redux/actions";

export default function SettingsScreen({props}) {

  const dispatch = useDispatch();

  function clearDataButton() {
    Alert.alert(
      "Are you sure you want to clear all workout data?",
      "This cannot be undone. Continue?",
      [
        {
          text: "Cancel",
          style: 'cancel'
        },
        {
          text: "Continue",
          style: 'destructive', 
          onPress: () => { 
            dispatch(setWorkouts([])); 
            dispatch(setTemplates([]));
          }
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Button
        title="Clear Data"
        onPress={() => { clearDataButton() }}
      />
      <Text>Coming soon!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});