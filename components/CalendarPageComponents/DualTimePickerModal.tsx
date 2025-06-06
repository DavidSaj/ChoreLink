import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal";


const screenHeight = Dimensions.get("window").height;
const ITEM_HEIGHT = 56;

type Props = {
  visible: boolean;
  initialHour: number;
  initialMinute: number;
  onClose: () => void;
  onConfirm: (hour: number, minute: number) => void;
};

export default function DualTimePickerModal({
  visible,
  initialHour,
  initialMinute,
  onClose,
  onConfirm,
}: Props) {
  const now = new Date();
  const defaultHour = now.getHours();
  const defaultMinute = 0;

  const [selectedHour, setSelectedHour] = useState(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState(defaultMinute);

  const hourRef = useRef<FlatList<number>>(null!);
  const minuteRef = useRef<FlatList<number>>(null!);

  useEffect(() => {
    if (visible) {
      const hour = initialHour ?? defaultHour;
      const minute = initialMinute ?? defaultMinute;
      setSelectedHour(hour);
      setSelectedMinute(minute);

      setTimeout(() => {
        hourRef.current?.scrollToIndex({ index: hour, animated: false });
        minuteRef.current?.scrollToIndex({ index: minute, animated: false });
      }, 0);
    }
  }, [visible]);

  const handleSnap = (
    ref: React.RefObject<FlatList<number>>,
    setSelected: (val: number) => void,
    maxIndex: number
  ) => (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / ITEM_HEIGHT);
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    ref.current?.scrollToIndex({ index, animated: true });
    setSelected(index);
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Time</Text>
          <View style={styles.pickerRow}>
            {/* Highlighted Area */}
            <View style={styles.highlightLine} pointerEvents="none" />

            {/* Hour Picker */}
            <View style={styles.column}>
              <FlatList
                ref={hourRef}
                data={Array.from({ length: 24 }, (_, i) => i)}
                keyExtractor={(item) => `h-${item}`}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                initialNumToRender={24}
                contentContainerStyle={{ paddingVertical: 84 }}
                style={{ height: 224 }}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                  hourRef.current?.scrollToOffset({
                    offset: index * averageItemLength,
                    animated: true,
                  });
                }}
                onMomentumScrollEnd={(e) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  let index = Math.round(offsetY / ITEM_HEIGHT);
                  index = Math.max(0, Math.min(index, 23));
                  hourRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
                  setSelectedHour(index);
                }}
                renderItem={({ item }) => (
                  <View style={styles.timeItem}>
                    <Text style={styles.timeText}>
                      {String(item).padStart(2, "0")}
                    </Text>
                  </View>
                )}
              />
            </View>

            {/* Minute Picker */}
            <View style={styles.column}>
              <FlatList
                ref={minuteRef}
                data={Array.from({ length: 60 }, (_, i) => i)}
                keyExtractor={(item) => `m-${item}`}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                initialNumToRender={60}
                contentContainerStyle={{ paddingVertical: 84 }}
                style={{ height: 224 }}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                  minuteRef.current?.scrollToOffset({
                    offset: index * averageItemLength,
                    animated: true,
                  });
                }}
                onMomentumScrollEnd={(e) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  let index = Math.round(offsetY / ITEM_HEIGHT);
                  index = Math.max(0, Math.min(index, 59));
                  minuteRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
                  setSelectedMinute(index);
                }}
                renderItem={({ item }) => (
                  <View style={styles.timeItem}>
                    <Text style={styles.timeText}>
                      {String(item).padStart(2, "0")}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              onConfirm(selectedHour, selectedMinute);
              onClose();
            }}
          >
            <Text style={styles.doneText}>Done</Text>
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
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.6,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
    height: 224,
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingHorizontal: 24, // Add this line to widen the scrollable area
  },
  timeItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 24,
    color: "#222",
  },
  highlightLine: {
    position: "absolute",
    top: "50%",
    marginTop: -ITEM_HEIGHT / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    zIndex: 0,
  },
  doneButton: {
    marginTop: 24,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
