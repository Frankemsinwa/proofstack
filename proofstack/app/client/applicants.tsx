import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

interface Applicant {
  id: string;
  name: string;
  trustScore: number;
}

const mockApplicants: Applicant[] = [
  { id: '1', name: 'Alice', trustScore: 92 },
  { id: '2', name: 'Bob', trustScore: 85 },
  { id: '3', name: 'Charlie', trustScore: 78 },
];

const ViewApplicantsScreen = () => {
  const renderItem = ({ item }: { item: Applicant }) => (
    <Link href={`../talent/portfolio`} asChild>
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.trustScore}>Trust Score: {item.trustScore}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Applicants</Text>
      <FlatList
        data={mockApplicants}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  trustScore: {
    fontSize: 16,
    color: '#9B3EFF',
    fontWeight: 'bold',
  },
});

export default ViewApplicantsScreen;
