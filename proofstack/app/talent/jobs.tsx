import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

interface Job {
  id: string;
  title: string;
  company: string;
  isAiSuggested: boolean;
}

const mockJobs: Job[] = [
  { id: '1', title: 'React Native Developer', company: 'TechCorp', isAiSuggested: true },
  { id: '2', title: 'UI/UX Designer', company: 'DesignHub', isAiSuggested: false },
  { id: '3', title: 'Frontend Developer', company: 'WebWorks', isAiSuggested: true },
];

const JobBoardScreen = () => {
  const renderItem = ({ item }: { item: Job }) => (
    <Link href={`./job-detail/${item.id}`} asChild>
      <TouchableOpacity style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemCompany}>{item.company}</Text>
        </View>
        {item.isAiSuggested && <Text style={styles.aiBadge}>AI Suggested</Text>}
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Board</Text>
      <FlatList
        data={mockJobs}
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
  itemTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  itemCompany: {
    fontSize: 14,
    color: '#C7C7C7',
    marginTop: 5,
  },
  aiBadge: {
    color: '#00F5A0',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default JobBoardScreen;
