// src/screens/ReportsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const ReportsScreen = () => {
  // Chart dimensions
  const chartWidth = Dimensions.get('window').width - 40;
  const chartHeight = 200;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Supermarket Analytics</Text>

      {/* 1. Sales Trend Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales Trend (Last 7 Days)</Text>
        <View style={[styles.chart, { height: chartHeight }]}>
          {/* Placeholder for line chart */}
          <View style={styles.lineChart}>
            <View style={[styles.line, { height: '80%', left: '10%' }]} />
            <View style={[styles.line, { height: '60%', left: '30%' }]} />
            <View style={[styles.line, { height: '90%', left: '50%' }]} />
            <View style={[styles.line, { height: '40%', left: '70%' }]} />
            <View style={[styles.line, { height: '70%', left: '90%' }]} />
          </View>
        </View>
      </View>

      {/* 2. Stock Levels Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Current Stock Levels</Text>
        <View style={[styles.chart, { height: chartHeight }]}>
          <View style={styles.barChart}>
            <View style={[styles.bar, { height: '30%', backgroundColor: '#4CAF50' }]} />
            <View style={[styles.bar, { height: '60%', backgroundColor: '#2196F3' }]} />
            <View style={[styles.bar, { height: '45%', backgroundColor: '#FF9800' }]} />
            <View style={[styles.bar, { height: '80%', backgroundColor: '#F44336' }]} />
            <View style={[styles.bar, { height: '25%', backgroundColor: '#9C27B0' }]} />
          </View>
        </View>
      </View>

      {/* 3. Category Distribution Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Inventory by Category</Text>
        <View style={[styles.chart, { height: chartHeight }]}>
          <View style={styles.pieChart}>
            <View style={[styles.pieSlice, { backgroundColor: '#FF6384', transform: [{ rotate: '0deg' }] }]} />
            <View style={[styles.pieSlice, { backgroundColor: '#36A2EB', transform: [{ rotate: '72deg' }] }]} />
            <View style={[styles.pieSlice, { backgroundColor: '#FFCE56', transform: [{ rotate: '144deg' }] }]} />
            <View style={[styles.pieSlice, { backgroundColor: '#4BC0C0', transform: [{ rotate: '216deg' }] }]} />
            <View style={[styles.pieSlice, { backgroundColor: '#9966FF', transform: [{ rotate: '288deg' }] }]} />
          </View>
        </View>
      </View>

      {/* 4. Top Selling Items Horizontal Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top Selling Items</Text>
        <View style={[styles.chart, { height: 180 }]}>
          <View style={styles.horizontalBarChart}>
            <View style={[styles.hBar, { width: '70%', backgroundColor: '#FF6384' }]} />
            <View style={[styles.hBar, { width: '85%', backgroundColor: '#36A2EB' }]} />
            <View style={[styles.hBar, { width: '60%', backgroundColor: '#FFCE56' }]} />
            <View style={[styles.hBar, { width: '45%', backgroundColor: '#4BC0C0' }]} />
            <View style={[styles.hBar, { width: '30%', backgroundColor: '#9966FF' }]} />
          </View>
        </View>
      </View>

      {/* 5. Stock Movement Area Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Stock Movement</Text>
        <View style={[styles.chart, { height: chartHeight }]}>
          <View style={styles.areaChart}>
            <View style={styles.areaFill} />
            <View style={styles.areaLine} />
          </View>
        </View>
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
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  // Line Chart Styles
  lineChart: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  line: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    backgroundColor: '#FF6384',
  },
  // Bar Chart Styles
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  bar: {
    width: 30,
    borderRadius: 4,
  },
  // Pie Chart Styles
  pieChart: {
    width: 150,
    height: 150,
    borderRadius: 75,
    position: 'relative',
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 75,
    left: '50%',
    top: 0,
    transformOrigin: 'left center',
  },
  // Horizontal Bar Chart Styles
  horizontalBarChart: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  hBar: {
    height: 20,
    borderRadius: 4,
    marginVertical: 4,
  },
  // Area Chart Styles
  areaChart: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  areaFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  areaLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(75, 192, 192, 1)',
  },
});