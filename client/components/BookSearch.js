import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
  Alert,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/config";
import { useThemeColor } from "../hooks/useThemeColor";

export default function BookSearch({ onAddFavorite }) {
  // HOOKS SIEMPRE AL INICIO
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [selected, setSelected] = useState(null);

  // Hooks de tema
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

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
      // Filtrar libros únicos por id
      const uniqueBooks = [];
      const seenIds = new Set();
      for (const book of books) {
        if (!seenIds.has(book.id)) {
          uniqueBooks.push(book);
          seenIds.add(book.id);
        }
      }
      setResults(uniqueBooks);
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
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No hay sesión activa");
        return;
      }
      const response = await fetch(`${API_URL}/api/libros`, {
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
      if (!response.ok) {
        throw new Error("Error al guardar el libro");
      }
      const savedBook = await response.json();
      onAddFavorite(savedBook.book || savedBook);
      setSelected(null);
      setComments((prev) => {
        const newComments = { ...prev };
        delete newComments[book.id];
        return newComments;
      });
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: cardColor, borderColor },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar libro por título"
          placeholderTextColor={textColor}
          style={[styles.searchInput, { color: textColor, borderColor }]}
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: primaryColor }]}
          onPress={searchBooks}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <ActivityIndicator style={styles.loader} color={primaryColor} />
      )}
      <ScrollView
        style={styles.resultsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {results.map((book) => (
          <TouchableOpacity
            key={book.id}
            onPress={() => setSelected(book)}
            style={[
              styles.bookCard,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            {book.image && (
              <Image source={{ uri: book.image }} style={styles.bookImage} />
            )}
            <View style={styles.bookInfo}>
              <Text style={[styles.bookTitle, { color: textColor }]}>
                {book.title}
              </Text>
              {!!book.author && (
                <Text style={[styles.bookAuthor, { color: textColor }]}>
                  {book.author}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            {selected && (
              <ScrollView>
                {selected.image && (
                  <Image
                    source={{ uri: selected.image }}
                    style={styles.modalImage}
                  />
                )}
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {selected.title}
                </Text>
                {!!selected.author && (
                  <Text style={[styles.modalAuthor, { color: textColor }]}>
                    {selected.author}
                  </Text>
                )}
                {!!selected.description && (
                  <Text style={[styles.modalDescription, { color: textColor }]}>
                    {selected.description}
                  </Text>
                )}
                <TextInput
                  value={comments[selected.id] || ""}
                  onChangeText={(t) => handleCommentChange(selected.id, t)}
                  placeholder="Comentario"
                  placeholderTextColor={textColor}
                  style={[
                    styles.commentInput,
                    { color: textColor, borderColor },
                  ]}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: primaryColor },
                    ]}
                    onPress={() => saveBookToFavorites(selected)}
                  >
                    <Text style={styles.buttonText}>Agregar a favoritos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setSelected(null)}
                  >
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 8,
    paddingBottom: 0,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    marginTop: 8,
  },
  resultsContainer: {
    maxHeight: 220,
    marginBottom: 8,
  },
  bookCard: {
    flexDirection: "row",
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  bookImage: {
    width: 48,
    height: 72,
    borderRadius: 4,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 13,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  modalImage: {
    width: 120,
    height: 180,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  modalAuthor: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: "top",
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
