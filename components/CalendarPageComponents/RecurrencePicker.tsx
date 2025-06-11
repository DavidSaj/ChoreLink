
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

type RecurrenceOption = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  selectedValue: string;
};

const recurrenceOptions: RecurrenceOption[] = [
  { id: "none", label: "None", value: "none" },
  { id: "daily", label: "Daily", value: "daily" },
  { id: "weekly", label: "Weekly", value: "weekly" },
  { id: "biweekly", label: "Bi-weekly", value: "biweekly" },
  { id: "monthly", label: "Monthly", value: "monthly" },
  { id: "quarterly", label: "Quarterly", value: "quarterly" },
  { id: "biannually", label: "Bi-annually", value: "biannually" },
  { id: "yearly", label: "Yearly", value: "yearly" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function RecurrencePickerModal({
  visible,
  onClose,
  onSelect,
  selectedValue,
}: Props) {
  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalContainer}
        onPress={(e) => e.stopPropagation()}
      >
        <Text style={styles.title}>Select Recurrence</Text>
        
        <FlatList
          data={recurrenceOptions}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 300 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionItem,
                selectedValue === item.value && styles.selectedItem,
              ]}
              onPress={() => handleSelect(item.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === item.value && styles.selectedText,
                ]}
              >
                {item.label}
              </Text>
              {selectedValue === item.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: "#222",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
    borderColor: "#3b82f6",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
