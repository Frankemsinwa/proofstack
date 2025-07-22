import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const SuccessScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're All Set!</Text>
      <Text style={styles.subtitle}>Welcome to the community.</Text>
      <Link href="../talent" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0E10',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#C7C7C7',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#9B3EFF',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
