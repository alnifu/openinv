// src/screens/ReportsScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { getReportData } from "../utils/reportHelpers";
import { useFocusEffect } from "@react-navigation/native";

const ReportsScreen = () => {
  const [reportData, setReportData] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const data = await getReportData();
        if (isActive) {
          setReportData(data);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (!reportData) {
    return <Text style={{ padding: 16 }}>Loading...</Text>;
  }

  const chartWidth = Dimensions.get("window").width - 40;
  const chartHeight = 200;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Grocery Analytics</Text>

        {/* 1. Weekly Sales Trend */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Sales Trend (Last 7 Days)</Text>
          <View style={styles.chart}>
            {Object.entries(reportData.salesTrend).map(([date, value], idx) => (
              <View
                key={idx}
                style={{ flexDirection: "row", marginVertical: 4 }}
              >
                <Text style={{ flex: 3 }}>{date}</Text>
                <Text style={{ flex: 7 }}>₱{value.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 2. Stock Levels */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Current Stock Levels</Text>
          <View style={styles.chart}>
            {reportData.stockLevels.map((item: any) => (
              <View
                key={item.id}
                style={{ flexDirection: "row", marginVertical: 4 }}
              >
                <Text style={{ flex: 3 }}>{item.itemName}</Text>
                <Text style={{ flex: 7 }}>{item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3. Category Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Inventory by Category</Text>
          <View style={styles.chart}>
            {Object.entries(reportData.categoryDistribution).map(
              ([cat, qty]) => (
                <View
                  key={cat}
                  style={{ flexDirection: "row", marginVertical: 4 }}
                >
                  <Text style={{ flex: 3 }}>{cat}</Text>
                  <Text style={{ flex: 7 }}>{qty}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* 4. Top Selling Items */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Top Selling Items</Text>
          <View style={styles.chart}>
            {reportData.topSelling.map(([item, qty]: any, index: number) => (
              <View
                key={index}
                style={{ flexDirection: "row", marginVertical: 4 }}
              >
                <Text style={{ flex: 3 }}>{item}</Text>
                <Text style={{ flex: 7 }}>{qty} sold</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. Low Stock Items */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Low Stock Items (≤5)</Text>
          <View style={styles.chart}>
            {reportData.lowStockItems.length === 0 ? (
              <Text style={{ textAlign: "center" }}>
                No items are low on stock.
              </Text>
            ) : (
              reportData.lowStockItems.map((item: any) => (
                <View
                  key={item.id}
                  style={{ flexDirection: "row", marginVertical: 4 }}
                >
                  <Text style={{ flex: 3 }}>{item.itemName}</Text>
                  <Text style={{ flex: 7 }}>{item.quantity} left</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  chartContainer: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  chart: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
});
