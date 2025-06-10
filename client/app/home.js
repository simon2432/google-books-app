import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";
import BookSearch from "../components/BookSearch";
import FavoriteList from "../components/FavoriteList";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileAndFavorites = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Error al obtener perfil");
        }

        const data = await res.json();
        setProfile(data);

        const favRes = await fetch(`${API_URL}/api/libros`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavorites(favData);
        }
      } catch (err) {
        console.error("ERROR PERFIL:", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndFavorites();
  }, []);

  const updateFavorite = async (id, comentario) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await fetch(`${API_URL}/api/libros/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario }),
      });
    } catch (err) {
      console.error("ERROR ACTUALIZAR FAVORITO:", err);
    }
  };

  const deleteFavorite = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/libros/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("ERROR ELIMINAR FAVORITO:", err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
        />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {profile?.name || "Usuario"}
          </Text>
          <Text>{profile?.email}</Text>
        </View>
      </View>

      <BookSearch />

      <FavoriteList
        books={favorites}
        onUpdate={updateFavorite}
        onDelete={deleteFavorite}
      />

      <View style={{ padding: 16 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}
