import { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      await AsyncStorage.setItem("token", data.token);
      router.replace("/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        ...(Platform.OS === "web"
          ? { boxShadow: "0 0 10px rgba(0,0,0,0.1)" }
          : { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 }),
      }}
    >
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
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}
