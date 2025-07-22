import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import React from 'react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const mockPortfolio: PortfolioItem[] = [
  { id: '1', title: 'Project Alpha', description: 'A really cool project.', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Project Beta', description: 'Another great project.', image: 'https://via.placeholder.com/150' },
];

const ViewPortfolioScreen = () => {
  const renderItem = ({ item }: { item: PortfolioItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Portfolio</Text>
      <FlatList
        data={mockPortfolio}
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
    padding: 15,
    marginBottom: 15,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#C7C7C7',
  },
});

export default ViewPortfolioScreen;
