import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    if (!isScanning && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isScanning]);

  const startScanTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsScanning(false);
      setMessage('No barcode detected. Please try again.');
    }, 5000);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsScanning(false);
    setScannedData(data);
    setMessage(null);

    Alert.alert('Scanned Barcode', data, [{ text: 'OK' }], { cancelable: false });
  };

  const cancelScan = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsScanning(false);
    setMessage('Scan cancelled.');
  };

  if (!permission || !permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {isFocused && (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code128'],
            }}
          />
        )}
      </View>

      <View style={styles.controls}>
        {!isScanning ? (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              setScannedData(null);
              setMessage(null);
              setIsScanning(true);
              startScanTimeout();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.scanButtonText}>Scan Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.scanButton, styles.cancelButton]} onPress={cancelScan} activeOpacity={0.8}>
            <Text style={styles.scanButtonText}>Cancel Scan</Text>
          </TouchableOpacity>
        )}

        {message && <Text style={styles.messageText}>{message}</Text>}
        {scannedData && <Text style={styles.dataText}>Last scanned: {scannedData}</Text>}
      </View>
    </View>
  );
};

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 7, // roughly 70% of screen height
    backgroundColor: '#000',
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 3, // roughly 30% height for buttons & messages
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#1e90ff',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    shadowColor: '#ff4444',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageText: {
    color: '#ff6666',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  dataText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#aaa',
    fontSize: 16,
  },
});
