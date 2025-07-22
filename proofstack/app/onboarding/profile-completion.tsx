import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const ProfileCompletionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="#C7C7C7" />
      <TextInput style={styles.input} placeholder="Your Bio" placeholderTextColor="#C7C7C7" multiline />
      <TextInput style={styles.input} placeholder="Your Skills (comma separated)" placeholderTextColor="#C7C7C7" />
      <Link href="./success" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Finish</Text>
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
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#1A1A1E',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00F5A0',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#0E0E10',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileCompletionScreen;
