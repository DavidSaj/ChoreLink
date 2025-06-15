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

  const renderGridItems = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const days: (Date | string)[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
              style={styles.arrowButton}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{format(currentMonth, "MMMM yyyy")}</Text>
            <TouchableOpacity
              onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
              style={styles.arrowButton}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar grid including weekday headers */}
          <View style={styles.gridWrapper}>
            <FlatList
              data={renderGridItems()}
              keyExtractor={(item, index) =>
                typeof item === "string" ? item + index : item.toISOString()
              }
              numColumns={7}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
              renderItem={({ item }) => {
                if (typeof item === "string") {
                  return (
                    <View style={styles.gridCell}>
                      <Text style={styles.dayLabel}>{item}</Text>
                    </View>
                  );
                }

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
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        faded && styles.fadedDayText,
                        (isToday || isSelected) && { color: "#fff" },
                      ]}
                    >
                      {format(item, "d")}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Cancel button */}
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
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: Math.min(360, SCREEN_WIDTH * 0.95),
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    color: "#1f2937",
  },
  arrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  arrowText: {
    fontSize: 24,
    color: "#374151",
  },
  gridWrapper: {
    width: "100%",
    alignSelf: "center",
  },
  gridRow: {
    flex: 1,
    justifyContent: "space-between",
  },
  gridCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  dayLabel: {
    fontWeight: "600",
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 4,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  fadedDayText: {
    color: "#d1d5db",
  },
  selectedDay: {
    backgroundColor: "#3b82f6",
  },
  today: {
    backgroundColor: "#10b981",
  },
  closeButton: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
});
