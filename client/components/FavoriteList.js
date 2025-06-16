import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export default function FavoriteList({ books, onUpdate, onDelete }) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Mis Favoritos</Text>
      {books.map((book) => (
        <FavoriteItem
          key={book.id}
          book={book}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}

function FavoriteItem({ book, onUpdate, onDelete }) {
  const [comment, setComment] = useState(book.comentario || "");
  const [isEditing, setIsEditing] = useState(false);

  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

  const handleSave = () => {
    onUpdate && onUpdate(book.id, comment);
    setIsEditing(false);
  };

  return (
    <View
      style={[styles.bookCard, { backgroundColor: cardColor, borderColor }]}
    >
      <View style={styles.bookContent}>
        {book.imagenUrl && (
          <Image source={{ uri: book.imagenUrl }} style={styles.bookImage} />
        )}
        <View style={styles.bookInfo}>
          <Text style={[styles.bookTitle, { color: textColor }]}>
            {book.titulo}
          </Text>
          {!!book.autores && (
            <Text style={[styles.bookAuthor, { color: textColor }]}>
              {book.autores}
            </Text>
          )}
          {book.fechaGuardado && (
            <Text style={[styles.bookDate, { color: textColor }]}>
              {new Date(book.fechaGuardado).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.commentSection}>
        {isEditing ? (
          <>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Comentario"
              placeholderTextColor={textColor}
              style={[styles.commentInput, { color: textColor, borderColor }]}
              multiline
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: primaryColor }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setComment(book.comentario || "");
                  setIsEditing(false);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {comment ? (
              <Text style={[styles.commentText, { color: textColor }]}>
                {comment}
              </Text>
            ) : (
              <Text style={[styles.placeholderText, { color: textColor }]}>
                Sin comentarios
              </Text>
            )}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: primaryColor }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => onDelete(book.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
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
  bookContent: {
    flexDirection: "row",
    padding: 16,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    marginBottom: 4,
  },
  bookDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  commentSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  commentText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
