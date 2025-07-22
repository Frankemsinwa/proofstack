import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';

interface Message {
  id: string;
  from: string;
  preview: string;
}

const mockMessages: Message[] = [
  { id: '1', from: 'Alice', preview: 'Thanks for the opportunity!' },
  { id: '2', from: 'Bob', preview: 'I have a question about the project.' },
];

const InboxScreen = () => {
  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemFrom}>{item.from}</Text>
      <Text style={styles.itemPreview}>{item.preview}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>
      <FlatList
        data={mockMessages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#1A1A1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  itemFrom: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  itemPreview: {
    fontSize: 14,
    color: '#C7C7C7',
    marginTop: 5,
  },
});

export default InboxScreen;
