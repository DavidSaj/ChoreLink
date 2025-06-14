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
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function CalendarDaySelectionModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [selectedDate]);

  // --- FIX: Use same grid logic as CalendarModal, include weekday headers as first 7 items ---
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
  // --- END FIX ---

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
            <Text style={styles.monthText}>
              {format(currentMonth, "MMMM yyyy")}
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
              style={styles.arrowButton}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* --- FIX: Remove separate weekday labels, use FlatList for all grid items --- */}
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

                const isSelected = isSameDay(item, selectedDate);
                const isSecond = isSameDay(item, addDays(selectedDate, 1));
                const isThird = isSameDay(item, addDays(selectedDate, 2));
                const isInMonth = isSameMonth(item, currentMonth);
                const isToday = isSameDay(item, today);
                const isRange = isSecond || isThird;

                const todayInRange = isToday && isRange;

                // Background layer: range pills
                const backgroundStyle =
                  isRange || todayInRange
                    ? {
                        backgroundColor: isToday ? "#10b981" : "#e5e7eb",
                        position: "absolute" as const,
                        top: 2,
                        bottom: 2,
                        left: 2,
                        right: 2,
                        borderTopRightRadius: isThird ? 10 : 0,
                        borderBottomRightRadius: isThird ? 10 : 0,
                      }
                    : undefined;

                return (
                  <View style={styles.gridCell}>
                    {backgroundStyle && <View style={backgroundStyle} />}
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(item);
                        onClose();
                      }}
                      style={[
                        styles.dayButton,
                        isSelected && styles.selectedDay,
                        isSelected && isToday && styles.selectedToday,
                        isToday && !isSelected && !isRange && styles.today,
                      ]}
                    >
                      <Animated.Text
                        style={[
                          styles.dayText,
                          !isInMonth && styles.fadedDayText,
                          isSelected && { color: "#fff" },
                          isRange && !isSelected && { fontWeight: "600" },
                          {
                            transform: [{ scale: isSelected ? scaleAnim : 1 }],
                          },
                        ]}
                      >
                        {format(item, "d")}
                      </Animated.Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          {/* --- END FIX --- */}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// --- FIX: Add gridWrapper and gridRow styles for alignment, match CalendarModal ---
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
    marginVertical: 2,
    zIndex: 2,
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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  today: {
    backgroundColor: "#10b981",
    borderRadius: 100,
  },
  selectedToday: {
    backgroundColor: "#10b981",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
