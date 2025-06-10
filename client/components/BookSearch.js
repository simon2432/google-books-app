import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Image, Text, ScrollView } from 'react-native';

export default function BookSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}`
      );
      const data = await res.json();
      const books = (data.items || []).map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: (item.volumeInfo.authors || []).join(', '),
        description: item.volumeInfo.description,
        image: item.volumeInfo.imageLinks?.thumbnail,
      }));
      setResults(books);
    } catch (err) {
      console.error('ERROR SEARCH BOOKS:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar libro por título"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
      />
      <Button title="Buscar" onPress={searchBooks} />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
      <ScrollView style={{ marginTop: 12, maxHeight: 300 }}>
        {results.map((book) => (
          <View key={book.id} style={{ flexDirection: 'row', marginBottom: 12 }}>
            {book.image && (
              <Image
                source={{ uri: book.image }}
                style={{ width: 50, height: 75, marginRight: 8 }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{book.title}</Text>
              {!!book.author && <Text>{book.author}</Text>}
              {!!book.description && (
                <Text numberOfLines={3} style={{ fontSize: 12, marginTop: 4 }}>
                  {book.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
