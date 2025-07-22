import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const TalentDashboard = () => {
  const trustScore = 85; // Mock data

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      <View style={styles.trustScoreContainer}>
        <Text style={styles.trustScoreLabel}>Your Trust Score</Text>
        <Text style={styles.trustScoreValue}>{trustScore}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Apply for a Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Refer a Peer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Upload Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  trustScoreContainer: {
    backgroundColor: '#1A1A1E',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  trustScoreLabel: {
    fontSize: 18,
    color: '#C7C7C7',
  },
  trustScoreValue: {
    fontSize: 48,
    color: '#9B3EFF',
    fontWeight: 'bold',
  },
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#1A1A1E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TalentDashboard;
