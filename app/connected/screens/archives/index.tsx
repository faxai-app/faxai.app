import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Archives() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>ARCHIVES</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    marginTop: 15,
    textAlign: "center",
  },
});
