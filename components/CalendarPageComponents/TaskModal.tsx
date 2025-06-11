
import { format } from "date-fns";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal";
import type { Task } from "../../types/Task";
import CalendarModal from "./CalendarModal";
import DualTimePickerModal from "./DualTimePickerModal";

const members = [
  { name: "Unassigned", color: "#ccc" },
  { name: "Alice", color: "#f87171" },
  { name: "Bob", color: "#60a5fa" },
  { name: "Carol", color: "#34d399" },
];

export type TaskModalRef = {
  openModal: () => void;
  closeModal: () => void;
};

type TaskModalProps = {
  onClose: () => void;
  onSubmit: (task: Task) => void;
};

const TaskModal = forwardRef<TaskModalRef, TaskModalProps>(({ onClose, onSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(10);
  const [endMinute, setEndMinute] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [calendarOpen, setCalendarOpen] = useState<null | "start" | "end">(null);
  const [timePickerOpen, setTimePickerOpen] = useState<null | "start" | "end">(null);
  const [assignedTo, setAssignedTo] = useState<string>("Unassigned");

  useImperativeHandle(ref, () => ({
    openModal: () => setVisible(true),
    closeModal: () => setVisible(false),
  }));

  const resetForm = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setStartHour(9);
    setStartMinute(0);
    setEndHour(10);
    setEndMinute(0);
    setCalendarOpen(null);
    setTimePickerOpen(null);
    setAssignedTo("Unassigned");
    setTaskName("");
  };

  const handleClose = () => {
    setVisible(false);
    resetForm();
    onClose();
  };

  // Only one "sub-modal" open at a time
  const showTaskForm = visible && !calendarOpen && !timePickerOpen;
  const showCalendar = !!calendarOpen;
  const showTimePicker = !!timePickerOpen;

  return (
    <Modal
      isVisible={visible || showCalendar || showTimePicker}
      onBackdropPress={handleClose}
      style={{ margin: 0 }}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}

      // 🔹 Backdrop fades in/out (not directional)
      backdropOpacity={0.5}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={200}

      // 🔹 Modal content slides in from bottom
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={300}

    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={handleClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1} 
          onPress={(e) => e.stopPropagation()}
        >
          {showTaskForm && (
            <>
              <Text style={styles.title}>Create Task</Text>
              <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <TextInput
                  placeholder="Enter task name"
                  placeholderTextColor="#999"
                  value={taskName}
                  onChangeText={setTaskName}
                  style={styles.input}
                  autoFocus={false}
                  selectTextOnFocus={false}
                />

                {/* STARTS */}
                <Text style={styles.sectionTitle}>Starts</Text>
                <View style={styles.rowContainer}>
                  <TouchableOpacity
                    style={styles.dateTimeBox}
                    onPress={() => setCalendarOpen("start")}
                  >
                    <Text style={styles.boxLabel}>Date</Text>
                    <Text style={styles.boxValue}>
                      {format(startDate, "dd MMM yyyy")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dateTimeBox}
                    onPress={() => setTimePickerOpen("start")}
                  >
                    <Text style={styles.boxLabel}>Time</Text>
                    <Text style={styles.boxValue}>
                      {`${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ENDS */}
                <Text style={styles.sectionTitle}>Ends</Text>
                <View style={styles.rowContainer}>
                  <TouchableOpacity
                    style={styles.dateTimeBox}
                    onPress={() => setCalendarOpen("end")}
                  >
                    <Text style={styles.boxLabel}>Date</Text>
                    <Text style={styles.boxValue}>
                      {format(endDate, "dd MMM yyyy")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dateTimeBox}
                    onPress={() => setTimePickerOpen("end")}
                  >
                    <Text style={styles.boxLabel}>Time</Text>
                    <Text style={styles.boxValue}>
                      {`${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`}
                    </Text>
                  </TouchableOpacity>
                </View>

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

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    // Create task object and call onSubmit if needed
                    const task: Task = {
                      id: Date.now().toString(),
                      title: taskName,
                      startTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startHour, startMinute),
                      endTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endHour, endMinute),
                      assignedTo,
                    };
                    onSubmit(task);
                    handleClose();
                  }}
                >
                  <Text style={styles.saveText}>Save Task</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {showCalendar && (
        <CalendarModal
          visible={showCalendar}
          selectedDate={calendarOpen === "start" ? startDate : endDate}
          onSelect={(date) => {
            if (calendarOpen === "start") setStartDate(date);
            else setEndDate(date);
            setCalendarOpen(null);
          }}
          onClose={() => setCalendarOpen(null)}
        />
      )}

      {showTimePicker && (
        <DualTimePickerModal
          visible={showTimePicker}
          initialHour={
            timePickerOpen === "start"
              ? startHour
              : endHour
          }
          initialMinute={
            timePickerOpen === "start"
              ? startMinute
              : endMinute
          }
          onClose={() => setTimePickerOpen(null)}
          onConfirm={(hour, minute) => {
            if (timePickerOpen === "start") {
              setStartHour(hour);
              setStartMinute(minute);
            } else {
              setEndHour(hour);
              setEndMinute(minute);
            }
            setTimePickerOpen(null);
          }}
        />
      )}
    </Modal>
  );
});

export default TaskModal;

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "60%",
    width: SCREEN_WIDTH,
    alignSelf: "center",
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
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    color: "#222",
    backgroundColor: "#fff",
    minHeight: 44,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  dateTimeBox: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  boxLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  boxValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
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
