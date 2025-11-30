import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "./themes/colors";

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: object;
}

export const AppButton = ({ label, onPress, style }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image
        style={styles.deco}
        source={require("@/assets/images/deco-button.png")}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderBottomColor: "rgba(255, 255, 255, .1)",
    borderBottomWidth: 1,
  },
  label: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 20,
  },
  deco: {
    position: "absolute",
    transform: "scale(.8)",
    top: -15,
  },
});

export default AppButton;
