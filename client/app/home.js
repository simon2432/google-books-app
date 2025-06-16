import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";
import BookSearch from "../components/BookSearch";
import FavoriteList from "../components/FavoriteList";
import { useThemeColor } from "../hooks/useThemeColor";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

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
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  const updateFavorite = async (id, comment) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/libros/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: comment }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el libro");
      }

      setFavorites((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, comentario: comment } : book
        )
      );
    } catch (err) {
      console.error("ERROR UPDATE:", err);
    }
  };

  const deleteFavorite = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/libros/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el libro");
      }

      setFavorites((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("ERROR DELETE:", err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[styles.header, { backgroundColor: cardColor, borderColor }]}
      >
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textColor }]}>
              {profile?.name || "Usuario"}
            </Text>
            <Text style={[styles.profileEmail, { color: textColor }]}>
              {profile?.email}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: primaryColor }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <BookSearch
          onAddFavorite={(newBook) =>
            setFavorites((prev) => [newBook, ...prev])
          }
        />

        <FavoriteList
          books={favorites}
          onUpdate={updateFavorite}
          onDelete={deleteFavorite}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
});
