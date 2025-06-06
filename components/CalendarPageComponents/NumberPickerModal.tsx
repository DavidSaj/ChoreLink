import React from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (val: number) => void;
  range: number;
  selected: number;
  label: string;
};

export default function NumberPickerModal({
  visible,
  onSelect,
  range,
  selected,
  label,
}: Props) {
  let numbers;
  if (label === "Select year") {
    const currentYear = new Date().getFullYear();
    numbers = Array.from({ length: range }, (_, i) => i + currentYear);
  } else {
    numbers = Array.from({ length: range }, (_, i) => i + 1);
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{label}</Text>
          <FlatList
            data={numbers}
            keyExtractor={(item) => item.toString()}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  item === selected && styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item);
                }}
              >
                <Text style={styles.itemText}>{String(item).padStart(2, "0")}</Text>
              </TouchableOpacity>
            )}
          />
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
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.5,
    padding: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
  },
});
