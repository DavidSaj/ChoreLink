import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  label: string;
  value: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function TimePickerBox({ label, value, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});
