import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getItems, Item } from '../utils/storage';
import AddSaleForm from '../components/AddSaleForm';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [mode, setMode] = useState<'products' | 'sales'>('products');
  const [addSaleVisible, setAddSaleVisible] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

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
    }, 6000);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsScanning(false);
    setMessage(null);

    if (mode === 'products') {
      try {
        const items: Item[] = await getItems();
        const existingItem = items.find(item => item.itemId === data);
        if (existingItem) {
          navigation.navigate('ProductForm', { mode: 'edit', product: existingItem });
        } else {
          navigation.navigate('ProductForm', { mode: 'add', product: { itemId: data } });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to retrieve items.');
      }
    } else if (mode === 'sales') {
      setScannedBarcode(data);
      setAddSaleVisible(true);
    }
  };

  const cancelScan = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsScanning(false);
    setMessage('Scan cancelled.');
  };

  const handleSaleAdded = () => {};

  if (!permission || !permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mode Switch */}
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.switchButton, mode === 'products' && styles.switchActive]}
          onPress={() => setMode('products')}
        >
          <Text style={[styles.switchText, mode === 'products' && styles.switchTextActive]}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, mode === 'sales' && styles.switchActive]}
          onPress={() => setMode('sales')}
        >
          <Text style={[styles.switchText, mode === 'sales' && styles.switchTextActive]}>Sales</Text>
        </TouchableOpacity>
      </View>

      {/* Camera */}
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

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isScanning ? styles.cancel : styles.scan]}
          onPress={isScanning ? cancelScan : () => {
            setMessage(null);
            setIsScanning(true);
            startScanTimeout();
          }}
        >
          <Text style={styles.controlText}>{isScanning ? 'Cancel Scan' : 'Scan Now'}</Text>
        </TouchableOpacity>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>

      {/* Add Sale Form Modal */}
      <AddSaleForm
        visible={addSaleVisible}
        onClose={() => {
          setAddSaleVisible(false);
          setScannedBarcode(null);
        }}
        onSaleAdded={handleSaleAdded}
        initialBarcode={scannedBarcode || ''}
      />
    </View>
  );
};

export default ScannerScreen;

// ─────────────────────────────
// Styles
// ─────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#ccc',
    fontSize: 16,
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 14,
    gap: 12,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#222',
  },
  switchActive: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  switchText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 16,
  },
  switchTextActive: {
    color: '#fff',
  },
  cameraContainer: {
    flex: 7,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  controlButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
    elevation: 4,
  },
  scan: {
    backgroundColor: '#1e90ff',
  },
  cancel: {
    backgroundColor: '#ff4444',
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    color: '#ffa726',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 6,
    fontWeight: '600',
  },
});
