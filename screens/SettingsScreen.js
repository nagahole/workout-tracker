import { Button, Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import WorkoutsPerWeek from "../components/widgets/WorkoutsPerWeek";
import { setTheme } from "../redux/actions";

export default function ProfileScreen({route, navigation}) {

  const insets = useSafeAreaInsets();

  const theme = useSelector(state => state.theme);

  const dispatch = useDispatch();

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.h1}>Settings</Text>
        <Text style={styles.h3}>Theme</Text>
        <Button
          title="Light / Dark Mode"
          onPress={() => {
            if (theme === 'light') {
              StatusBar.setBarStyle('light-content', true);
            } else {
              StatusBar.setBarStyle('dark-content', true);
            }

            dispatch(setTheme(theme === 'light'? 'dark' : 'light'));
          }}
        />
        
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