import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const ChallengeOfTheWeekScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenge of the Week</Text>
      <View style={styles.challengeContainer}>
        <Text style={styles.challengeTitle}>Design a "Save" Icon</Text>
        <Text style={styles.challengeDescription}>
          The current "save" icon is a floppy disk. Design a more modern and intuitive icon to replace it.
        </Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit Your Entry</Text>
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
  challengeContainer: {
    backgroundColor: '#1A1A1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  challengeTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  challengeDescription: {
    fontSize: 16,
    color: '#C7C7C7',
    lineHeight: 24,
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

export default ChallengeOfTheWeekScreen;
