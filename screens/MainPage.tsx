import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import ChoreList from '../components/ChoreList';

const listNames = [
  { id: "1", name: "Upcoming Assigned Tasks" },
  { id: "2", name: "Upcoming Unassigned Tasks"},
];

const chores = [
  { id: '1', task: 'Take out trash', deadline: 'Today 18:00', score: 10, details: 'Take to green bin', listId: "1" },
  { id: '2', task: 'Wash dishes', deadline: 'Tomorrow 09:00', score: 15, details: 'Don’t forget cutlery', listId: "2" },
  { id: '3', task: 'Vacuum living room', deadline: 'Sunday', score: 20, details: 'Under the couch too', listId: "1" },
];

export default function MainPage() {
  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconLeft}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Household Name</Text>
        <TouchableOpacity style={styles.iconRight}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Hello, User</Text>
      </View>
      {/* Credit Score Circle */}
      <View style={styles.scoreCircleWrapper}>
        <View style={styles.whiteCircle}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
            <G rotation="-38" origin="50, 50">
              <Circle cx="50" cy="50" r="45" stroke="#a09cb0" strokeWidth="6" strokeDasharray="11.8" strokeLinecap="round" fill="none" />
            </G>
          </Svg>
          <Text style={styles.scoreText}>82</Text>
        </View>
      </View>
      {/* Main Card */}
      <View style={styles.mainCard}>
        <View style={styles.lists}>
          <ChoreList listNames={listNames} chores={chores}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#a09cb0',
  },
  topBar: {
    height: 90,
    backgroundColor: '#a09cb0',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 0,
    letterSpacing: 0.5,
  },
  greeting: {
    position: 'absolute',
    left: 24,
    bottom: 2, // moved further down
    color: "white",
    fontSize: 17, // slightly smaller
    fontWeight: "700",
    opacity: 0.97,
    letterSpacing: 0.2,
  },
  iconLeft: {
    position: 'absolute',
    left: 18,
    top: 28,
    zIndex: 3,
  },
  iconRight: {
    position: 'absolute',
    right: 18,
    top: 28,
    zIndex: 3,
  },
  // The circle overlaps the main card and top bar, right-aligned
  scoreCircleWrapper: {
    position: 'absolute',
    right: 28,
    top: 54,
    zIndex: 5,
    // Remove shadow and backgroundColor here to avoid the square
  },
  whiteCircle: {
    height: 88, // slightly smaller
    width: 88,  // slightly smaller
    borderRadius: 44,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  mainCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40, // pushes it down to overlap the top bar
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1,
  },
  lists: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 0,
  },
});
