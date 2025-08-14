import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !name || !fullName || !role || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, fullName, role, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        router.push('/auth/login');
      } else {
        Alert.alert('Error', data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
          dropdownIconColor="#ffffff"
        >
          <Picker.Item label="Select a role..." value="" />
          <Picker.Item label="Talent" value="talent" />
          <Picker.Item label="Client" value="client" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Link href="/auth/login" style={styles.loginLink}>
          Log In
        </Link>
        <Link href="/onboarding/profile-completion" style={styles.loginLink}>
         build
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  pickerContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#e0e0e0',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
