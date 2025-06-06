// components/CalendarHeader.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onAddTask: () => void;
  onGoToToday: () => void;
  onPrevDays: () => void;
  onNextDays: () => void;
};

export default function CalendarHeader({ onAddTask, onGoToToday, onPrevDays, onNextDays }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.arrowButton} onPress={onPrevDays}>
        <Text style={styles.arrowText}>{"‹"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.todayButton]} onPress={onGoToToday}>
        <Text style={[styles.buttonText, styles.todayText]}>Today</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.arrowButton} onPress={onNextDays}>
        <Text style={styles.arrowText}>{"›"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  arrowButton: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  arrowText: {
    fontSize: 22,
    color: "#222",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 4,
  },
  todayButton: {
    backgroundColor: "#00bfff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todayText: {
    color: "#fff",
  },
});
