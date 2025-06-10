import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useState } from "react";
import {
  Dimensions,
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

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CalendarModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  // Always render 6 rows (42 days)
  const renderDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = [];
    let date = start;
    for (let i = 0; i < 42; i++) {
      days.push(date);
      date = addDays(date, 1);
    }
    return days;
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header with stationary arrows */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
              style={styles.arrowButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.arrowText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{format(currentMonth, "MMMM yyyy")}</Text>
            <TouchableOpacity
              onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
              style={styles.arrowButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.arrowText}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Days of week */}
          <View style={styles.daysRow}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <FlatList
            data={renderDays()}
            keyExtractor={(item) => item.toISOString()}
            numColumns={7}
            scrollEnabled={false}
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
                    isSelected && !isToday && styles.selectedDay,
                    isSelected && { transform: [{ scale: 1.08 }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      faded && styles.fadedDayText,
                      isToday && { color: "#fff" },
                      isSelected && !isToday && { color: "#fff" },
                    ]}
                  >
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
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: Math.min(340, SCREEN_WIDTH * 0.96), // Responsive width, max 340
    backgroundColor: "#f9fafb",
    borderRadius: 28,
    padding: 16, // Less padding for smaller look
    maxHeight: "92%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    height: 48,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    paddingBottom: 6,
  },
  monthText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    color: "#22223b",
    letterSpacing: 0.5,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#e0e7ef",
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowText: {
    fontSize: 24,
    color: "#22223b",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    marginTop: 2,
  },
  dayLabel: {
    width: 32,
    textAlign: "center",
    fontWeight: "700",
    color: "#a0aec0",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "transparent",
  },
  dayText: {
    fontSize: 15,
    color: "#22223b",
    fontWeight: "500",
  },
  fadedDayText: {
    color: "#cbd5e1",
  },
  selectedDay: {
    backgroundColor: "#3b82f6",
    borderColor: "#2563eb",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  today: {
    backgroundColor: "#f87171",
    borderColor: "#ef4444",
  },
  closeButton: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#e0e7ef",
    paddingVertical: 8,
    marginHorizontal: 24,
  },
  closeText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
