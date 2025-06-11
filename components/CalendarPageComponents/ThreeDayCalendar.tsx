import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { addDays, format, subDays } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Task } from "../../types/Task";
import TaskModal, { type TaskModalRef } from "./TaskModal";

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);


const SCREEN_WIDTH = Dimensions.get("window").width;



export default function ThreeDayCalendar() {
  const [startDate, setStartDate] = useState(new Date());
  const scrollRef = useRef<ScrollView>(null);
  const taskModalRef = useRef<TaskModalRef>(null);

  const handleAddTask = (task: Task) => {
    console.log("Task added:", task);
  };


  // Calculate the current hour index
  const now = new Date();
  const currentHour = now.getHours();
  const scrollToHour = currentHour > 18 ? 18 : currentHour;
  const CELL_HEIGHT = 60;

  // Scroll to the correct hour on first mount
  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: scrollToHour * CELL_HEIGHT,
      animated: false,
    });
  }, []); // empty dependency array = only on first mount

  // Always scroll to the current hour (or 18:00) when page is unfocused
  useFocusEffect(
    useCallback(() => {
      // No action needed when focused
      return () => {
        // Scroll to the correct hour
        scrollRef.current?.scrollTo({
          y: scrollToHour * CELL_HEIGHT,
          animated: false,
        });
        // Set the first day back to today
        setStartDate(new Date());
      };
    }, [scrollToHour])
  );

  const goToNextDays = () => {
    setStartDate(addDays(startDate, 3));
  };

  const goToPreviousDays = () => {
    setStartDate(subDays(startDate, 3));
  };

  const getDates = () => {
    return Array.from({ length: 3 }, (_, i) => addDays(startDate, i));
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousDays}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#3b82f6", padding: 6, borderRadius: 8 }}
            onPress={() => setStartDate(new Date())}
          >
            <Text style={{ color: "white" }}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#10b981", padding: 6, borderRadius: 8 }}
            onPress={() => taskModalRef.current?.openModal()}
          >
            <Text style={{ color: "white" }}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goToNextDays}>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Task Modal */}
      <TaskModal
        ref={taskModalRef}
        onClose={() => {}}
        onSubmit={handleAddTask}
      />

      {/* Date Row */}
      <View style={styles.datesRow}>
        <View style={styles.timeColumn} />
        {getDates().map((date, i) => (
          <View style={styles.dateColumn} key={i}>
            <Text style={styles.dateText}>{format(date, "EEE")}</Text>
            <Text style={styles.dateText}>{format(date, "MMM d")}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.grid}>
          {/* Time Column */}
          <View style={styles.timeColumn}>
            {hours.map((hour, i) => (
              <Text
                key={i}
                style={[
                  styles.hourText,
                  i === currentHour ? styles.hourTextCurrent : null,
                ]}
              >
                {hour}
              </Text>
            ))}
          </View>

          {/* Day Columns */}
          {getDates().map((date, idx) => (
            <View style={styles.dayColumn} key={idx}>
              {hours.map((_, i) => (
                <View key={i} style={styles.cell} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  datesRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  dateColumn: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flex: 1,
  },
  timeColumn: {
    width: 50,
    paddingRight: 5,
    alignItems: "flex-end",
  },
  hourText: {
    fontSize: 12,
    color: "#666",
    height: 60,
    textAlignVertical: "center",
    textAlign: "right",
    paddingRight: 4,
  },
  hourTextCurrent: {
    color: "red",
    fontWeight: "bold",
  },
  dayColumn: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: "#eee",
  },
  cell: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
