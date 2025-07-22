import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const UploadPortfolioProjectScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Project</Text>
      <TextInput style={styles.input} placeholder="Project Title" placeholderTextColor="#C7C7C7" />
      <TextInput style={styles.input} placeholder="Project Description" placeholderTextColor="#C7C7C7" multiline />
      <TextInput style={styles.input} placeholder="Tags (comma separated)" placeholderTextColor="#C7C7C7" />
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Media</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit Project</Text>
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
  input: {
    width: '100%',
    backgroundColor: '#1A1A1E',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#1A1A1E',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#00F5A0',
    fontSize: 16,
    fontWeight: 'bold',
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

export default UploadPortfolioProjectScreen;
