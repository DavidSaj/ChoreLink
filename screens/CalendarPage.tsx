import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ThreeDayCalendar from '../components/ThreeDayCalendar';

export default function CalendarPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar Page</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 24,
    marginBottom: 18,
  },
});