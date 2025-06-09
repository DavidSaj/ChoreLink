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
            <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))} style={styles.navButton}>
              <Text style={styles.navText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{format(currentMonth, "MMMM yyyy")}</Text>
            <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))} style={styles.navButton}>
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
  },
  container: {
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    maxHeight: "90%",
    alignSelf: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    height: 48,
  },
  monthText: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  navButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 12,
    zIndex: 1,
  },
  navLeft: {
    left: 0,
  },
  navRight: {
    right: 0,
  },
  navText: {
    fontSize: 28,
    padding: 8,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayLabel: {
    width: 40,
    textAlign: "center",
    fontWeight: "700",
    color: "#888",
    fontSize: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  dayText: {
    fontSize: 18,
    color: "#333",
  },
  selectedDay: {
    backgroundColor: "#3b82f6",
  },
  today: {
    backgroundColor: "#ef4444",
    borderWidth: 0,
  },
  closeButton: {
    marginTop: 18,
    alignItems: "center",
  },
  closeText: {
    color: "#3b82f6",
    fontSize: 18,
  },
});
