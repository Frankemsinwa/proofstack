import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const RoleSelectionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Link href="./profile-completion" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Talent</Text>
        </TouchableOpacity>
      </Link>
      <Link href="./profile-completion" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Client</Text>
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
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#9B3EFF',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;
