import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';


export default function MainPage() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.scoreContainer}>
          <View style={styles.whiteCircle}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
              <G rotation="-38" origin="50, 50">
                <Circle cx="50" cy="50" r="45" stroke="#a09cb0" strokeWidth="6" strokeDasharray="11.8" strokeLinecap="round" fill="none" />
              </G>
            </Svg>
            <Text style={styles.scoreText}>82</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 0, 
    backgroundColor: '#f5f5f5', 
  },

  topBar: {
    height: 140, 
    backgroundColor: '#a09cb0', 
    borderRadius: 0, 
    alignItems: "flex-end",
  },

  scoreContainer: {
    position: 'absolute',
    bottom: -40, 
    zIndex: 10, 
  },

  whiteCircle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', 
  },

  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },

});
