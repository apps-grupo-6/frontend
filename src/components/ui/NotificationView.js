import { useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

export default function NotificationView({
  visible,
  type,
  title,
  message,
  onClose,
}) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const icon = {
    success: "✓",
    error: "⨯",
    info: "ℹ",
  }[type];

  return (
    <Animated.View
      style={[
        styles.base,
        Platform.OS === "web" ? styles.webPosition : styles.mobilePosition,
        { transform: [{ translateY }], opacity },

        type === "success" && styles.successBg,
        type === "error" && styles.errorBg,
        type === "info" && styles.infoBg,
      ]}
    >
      {/* Icono */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Contenido */}
      <View style={styles.textContainer}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>

      {/* Botón cerrar */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 280,
    maxWidth: 360,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(30, 30, 30, 1)",
    backdropFilter: Platform.OS === "web" ? "blur(12px)" : undefined,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,

    zIndex: 9999,
  },

  webPosition: {
    position: "fixed",
    right: 26,
    bottom: 26,
  },

  mobilePosition: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    alignSelf: "center",
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  icon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  message: {
    color: "#eee",
    fontSize: 14,
    lineHeight: 18,
  },

  closeButton: {
    marginLeft: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 18,
    color: "#fff",
  },

  successBg: {
    borderLeftWidth: 5,
    borderLeftColor: "#22c55e",
  },
  errorBg: {
    borderLeftWidth: 5,
    borderLeftColor: "#ef4444",
  },
  infoBg: {
    borderLeftWidth: 5,
    borderLeftColor: "#3b82f6",
  },
});
