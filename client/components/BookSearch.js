import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/config";

export default function BookSearch({ onAddFavorite }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [selected, setSelected] = useState(null);

  const handleCommentChange = (id, text) => {
    setComments((prev) => ({ ...prev, [id]: text }));
  };

  const searchBooks = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      const books = (data.items || [])
        .filter((item) => item.volumeInfo.imageLinks?.thumbnail)
        .map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: (item.volumeInfo.authors || []).join(", "),
          description: item.volumeInfo.description,
          image: item.volumeInfo.imageLinks?.thumbnail,
        }));

      setResults(books);
    } catch (err) {
      console.error("ERROR SEARCH BOOKS:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim() === "") setResults([]);
  }, [query]);

  const saveBookToFavorites = async (book) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/libros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          googleBookId: book.id,
          titulo: book.title,
          autores: book.author,
          imagenUrl: book.image,
          comentario: comments[book.id] || "",
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        Alert.alert("Info", "Este libro ya estaba en favoritos.");
      } else if (res.status === 201) {
        Alert.alert("Éxito", "Libro guardado en favoritos.");
        onAddFavorite && onAddFavorite(data.book); // Actualizar lista en Home
        setComments((prev) => ({ ...prev, [book.id]: "" }));
      } else {
        throw new Error(data?.error || "Error desconocido");
      }
    } catch (err) {
      console.error("ERROR GUARDAR LIBRO:", err);
      Alert.alert("Error", "No se pudo guardar el libro.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar libro por título"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 8,
        }}
      />
      <Button title="Buscar" onPress={searchBooks} />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
      <ScrollView style={{ marginTop: 12, maxHeight: 300 }}>
        {results.map((book) => (
          <TouchableOpacity
            key={book.id}
            onPress={() => setSelected(book)}
            style={{
              flexDirection: "row",
              marginBottom: 12,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            {book.image && (
              <Image
                source={{ uri: book.image }}
                style={{ width: 50, height: 75, marginRight: 8 }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold" }}>{book.title}</Text>
              {!!book.author && <Text>{book.author}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              maxHeight: "80%",
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
            }}
          >
            {selected && (
              <ScrollView>
                {selected.image && (
                  <Image
                    source={{ uri: selected.image }}
                    style={{ width: 120, height: 180, alignSelf: "center" }}
                  />
                )}
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, marginTop: 8 }}
                >
                  {selected.title}
                </Text>
                {!!selected.author && (
                  <Text style={{ marginBottom: 8 }}>{selected.author}</Text>
                )}
                {!!selected.description && (
                  <Text style={{ marginBottom: 12 }}>
                    {selected.description}
                  </Text>
                )}
                <TextInput
                  value={comments[selected.id] || ""}
                  onChangeText={(t) => handleCommentChange(selected.id, t)}
                  placeholder="Comentario"
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 4,
                    marginBottom: 12,
                  }}
                />
                <Button
                  title="Agregar a favoritos"
                  onPress={() => {
                    saveBookToFavorites(selected);
                    setSelected(null);
                  }}
                />
                <View style={{ height: 8 }} />
                <Button title="Cerrar" onPress={() => setSelected(null)} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
