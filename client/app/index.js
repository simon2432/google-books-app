import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";
import { useThemeColor } from "../hooks/useThemeColor";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

  const handleAuth = async () => {
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la autenticación");
      }

      if (!isRegister) {
        await AsyncStorage.setItem("token", data.token);
        router.replace("/home");
      } else {
        Alert.alert("Éxito", "Usuario registrado. Ahora inicia sesión.");
        setIsRegister(false);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[styles.card, { backgroundColor: cardColor, borderColor }]}
        >
          <Image
            source={require("../assets/images/book-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: textColor }]}>
            {isRegister ? "Registro" : "Bienvenido"}
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            {isRegister
              ? "Crea tu cuenta para comenzar"
              : "Inicia sesión para continuar"}
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: textColor }]}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[styles.input, { color: textColor, borderColor }]}
                placeholder="tu@email.com"
                placeholderTextColor={textColor}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: textColor }]}>
                Contraseña
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, { color: textColor, borderColor }]}
                placeholder="••••••••"
                placeholderTextColor={textColor}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primaryColor }]}
              onPress={handleAuth}
            >
              <Text style={styles.buttonText}>
                {isRegister ? "Registrarse" : "Iniciar sesión"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsRegister((v) => !v)}
            >
              <Text style={[styles.switchText, { color: primaryColor }]}>
                {isRegister
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    padding: 8,
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
