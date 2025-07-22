import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const ClientDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Dashboard</Text>
      <Text style={styles.subtitle}>Overview of posted jobs and new applicants.</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#C7C7C7',
  },
});

export default ClientDashboard;
