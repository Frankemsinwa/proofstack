import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const JobDetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Detail {id}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.jobTitle}>React Native Developer</Text>
        <Text style={styles.company}>TechCorp</Text>
        <Text style={styles.description}>
          We are looking for an experienced React Native developer to join our team.
        </Text>
      </View>
      <View style={styles.proposalContainer}>
        <Text style={styles.proposalTitle}>AI-Generated Proposal</Text>
        <TextInput
          style={styles.proposalInput}
          multiline
          defaultValue="I am a great fit for this role because..."
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Apply Now</Text>
      </TouchableOpacity>
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
  detailsContainer: {
    backgroundColor: '#1A1A1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  company: {
    fontSize: 18,
    color: '#C7C7C7',
    marginTop: 5,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  proposalContainer: {
    marginBottom: 20,
  },
  proposalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  proposalInput: {
    backgroundColor: '#1A1A1E',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00F5A0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0E0E10',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JobDetailScreen;
