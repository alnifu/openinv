// src/screens/ReportsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReportsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reports</Text>

      {/* Mock Placeholder Graph */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Sales Overview</Text>
        <View style={styles.graph}>
          <View style={[styles.bar, { height: 50, backgroundColor: '#4caf50' }]} />
          <View style={[styles.bar, { height: 80, backgroundColor: '#2196f3' }]} />
          <View style={[styles.bar, { height: 30, backgroundColor: '#ff9800' }]} />
          <View style={[styles.bar, { height: 70, backgroundColor: '#f44336' }]} />
          <View style={[styles.bar, { height: 60, backgroundColor: '#9c27b0' }]} />
        </View>
        <Text style={styles.graphNote}>*This is a placeholder graph</Text>
      </View>
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  graphContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  graph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    marginBottom: 10,
  },
  bar: {
    width: 30,
    borderRadius: 4,
  },
  graphNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
