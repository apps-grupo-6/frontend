import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import colors from "@/theme/colors";

export default function QRScannerModal({ visible, onClose, onScan }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    
    if (onScan) {
      onScan(data);
    }
    onClose();
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (!result.granted && !result.canAskAgain) {
      Linking.openSettings();
    }
  };

  const renderContent = () => {
    if (!permission) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Cargando...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.icon}>📷</Text>
          <Text style={styles.title}>Permiso de Cámara</Text>
          <Text style={styles.messageText}>
            Necesitamos acceso a tu cámara para escanear códigos QR
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
            <Text style={styles.permissionButtonText}>Permitir Cámara</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        
        {/* Overlay con marco */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.scanHint}>Alineá el código QR dentro del marco</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escanear QR</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </Modal>
  );
}

const SCAN_AREA_SIZE = 250;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.dark,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  placeholder: {
    width: 40,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  messageText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayMiddle: {
    flexDirection: "row",
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingTop: 30,
  },
  scanHint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
