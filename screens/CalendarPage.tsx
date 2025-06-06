import { addMonths, format, subMonths } from 'date-fns';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ThreeDayCalendar from '../components/CalendarPageComponents/ThreeDayCalendar';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Text style={styles.navText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{format(currentMonth, "MMMM yyyy")}</Text>
        <TouchableOpacity style={styles.arrowButton} onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Text style={styles.navText}>▶</Text>
        </TouchableOpacity>
      </View>
      <ThreeDayCalendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  navText: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  selectedDay: {
    backgroundColor: '#3b82f6',
  },
  today: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
});