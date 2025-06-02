import React, { useState } from "react";
import type { Task } from "../types/Task"; // Add this import at the top

import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NumberPickerModal from "./NumberPickerModal";
import TimePickerBox from "./TimePickerBox";

type TaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
};

const members = [
  { name: "Unassigned", color: "#ccc" },
  { name: "Alice", color: "#f87171" },
  { name: "Bob", color: "#60a5fa" },
  { name: "Carol", color: "#34d399" },
];

export default function TaskModal({ visible, onClose }: TaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(0);
  const [durationHour, setDurationHour] = useState(1);
  const [durationMinute, setDurationMinute] = useState(0);
  const [pickerTarget, setPickerTarget] = useState<null | string>(null);
  const [assignedTo, setAssignedTo] = useState("Unassigned");

  const selectedValue =
    {
      startHour,
      startMinute,
      durationHour,
      durationMinute,
    }[pickerTarget ?? "startHour"] ?? 0;

  const getRange = () => (pickerTarget?.includes("Hour") ? 24 : 60);

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Create Task</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Task Name */}
              <TextInput
                placeholder="Enter task name"
                placeholderTextColor="#aaa"
                value={taskName}
                onChangeText={setTaskName}
                style={styles.input}
              />

              {/* Time Section */}
              <View style={styles.row}>
                <TimePickerBox
                  label="Start Time"
                  value={formatTime(startHour, startMinute)}
                  onPress={() => setPickerTarget("startHour")}
                />
                <TimePickerBox
                  label="Duration"
                  value={formatTime(durationHour, durationMinute)}
                  onPress={() => setPickerTarget("durationHour")}
                />
              </View>

              {/* Assignment */}
              <Text style={styles.sectionTitle}>Assign To</Text>
              <View style={styles.avatarRow}>
                {members.map((m) => (
                  <TouchableOpacity
                    key={m.name}
                    style={styles.avatarContainer}
                    onPress={() => setAssignedTo(m.name)}
                  >
                    <View
                      style={[
                        styles.circle,
                        {
                          backgroundColor: m.color,
                          borderWidth: assignedTo === m.name ? 2 : 0,
                          borderColor: "#333",
                        },
                      ]}
                    />
                    <Text style={styles.nameText}>{m.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={onClose}>
                <Text style={styles.saveText}>Save Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Picker Modal */}
      <NumberPickerModal
        visible={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        selected={selectedValue}
        range={getRange()}
        onSelect={(val) => {
          if (pickerTarget === "startHour") setStartHour(val);
          else if (pickerTarget === "startMinute") setStartMinute(val);
          else if (pickerTarget === "durationHour") setDurationHour(val);
          else if (pickerTarget === "durationMinute") setDurationMinute(val);

          // flow: hour → minute
          if (pickerTarget === "startHour") setPickerTarget("startMinute");
          else if (pickerTarget === "durationHour") setPickerTarget("durationMinute");
          else setPickerTarget(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "60%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },
  avatarRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
