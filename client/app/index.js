import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 8,
          ...(Platform.OS === "web"
            ? { boxShadow: "0 0 10px rgba(0,0,0,0.1)" }
            : { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 }),
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
          {isRegister ? "Registro" : "Login"}
        </Text>
        <Text>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderBottomWidth: 1,
            marginBottom: 12,
            paddingVertical: 4,
          }}
        />
        <Text>Contraseña:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderBottomWidth: 1,
            marginBottom: 20,
            paddingVertical: 4,
          }}
        />
        <Button
          title={isRegister ? "Registrarse" : "Iniciar sesión"}
          onPress={handleAuth}
        />
        <TouchableOpacity onPress={() => setIsRegister((v) => !v)}>
          <Text
            style={{ color: "#007bff", marginTop: 12, textAlign: "center" }}
          >
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
