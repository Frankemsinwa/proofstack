import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const SubmitPeerReferralScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer a Peer</Text>
      <TextInput style={styles.input} placeholder="Peer's Name or Email" placeholderTextColor="#C7C7C7" />
      <TextInput style={styles.input} placeholder="Write your referral..." placeholderTextColor="#C7C7C7" multiline />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit Referral</Text>
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
  button: {
    backgroundColor: '#9B3EFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubmitPeerReferralScreen;
