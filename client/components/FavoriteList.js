import React, { useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";

export default function FavoriteList({ books, onUpdate, onDelete }) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
        Mis Favoritos
      </Text>
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

  const handleSave = () => {
    onUpdate && onUpdate(book.id, comment);
  };

  return (
    <View style={{ flexDirection: "row", marginBottom: 12 }}>
      {book.imagenUrl && (
        <Image
          source={{ uri: book.imagenUrl }}
          style={{ width: 50, height: 75, marginRight: 8 }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{book.titulo}</Text>
        {!!book.autores && <Text>{book.autores}</Text>}
        {book.fechaGuardado && (
          <Text style={{ fontSize: 12, color: "#555" }}>
            {new Date(book.fechaGuardado).toLocaleDateString()}
          </Text>
        )}
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Comentario"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 4,
            marginTop: 4,
          }}
        />
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Button title="Guardar" onPress={handleSave} />
          <View style={{ width: 8 }} />
          <Button
            color="red"
            title="Eliminar"
            onPress={() => onDelete(book.id)}
          />
        </View>
      </View>
    </View>
  );
}
