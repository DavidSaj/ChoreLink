import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

type Props = {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function CalendarModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const renderDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

    const days = [];
    let date = start;
    while (date <= end) {
      days.push(date);
      date = addDays(date, 1);
    }
    return days;
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <Text style={styles.navText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{format(currentMonth, "MMMM yyyy")}</Text>
            <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <Text style={styles.navText}>▶</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.daysRow}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>

          <FlatList
            data={renderDays()}
            keyExtractor={(item) => item.toISOString()}
            numColumns={7}
            renderItem={({ item }) => {
              const isToday = isSameDay(item, today);
              const isSelected = isSameDay(item, selectedDate);
              const faded = !isSameMonth(item, currentMonth);

              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={[
                    styles.dayButton,
                    isToday && styles.today,
                    isSelected && !isToday && styles.selectedDay, // Only blue if selected and not today
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    faded && { color: "#bbb" },
                    isToday && { color: "#fff" }, // White text on red for today
                  ]}>
                    {format(item, "d")}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
  },
  navText: {
    fontSize: 18,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayLabel: {
    width: 32,
    textAlign: "center",
    fontWeight: "600",
    color: "#888",
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDay: {
    backgroundColor: "#3b82f6",
  },
  today: {
    backgroundColor: "#ef4444", // Red background for today
    borderWidth: 0,             // No border
  },
  closeButton: {
    marginTop: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#3b82f6",
    fontSize: 16,
  },
});
