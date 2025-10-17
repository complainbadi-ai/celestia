
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const RegistrationScreen = () => {
  const { colorScheme = 'light' } = useColorScheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('');
  const router = useRouter();

  const validateForm = () => {
    if (!email || !name || !birthDate || !sex) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      Alert.alert('Error', 'Please enter the date in YYYY-MM-DD format.');
      return false;
    }
    if (!/^[FM]$/i.test(sex)) {
      Alert.alert('Error', 'Please enter F or M for sex.');
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (validateForm()) {
      console.log('Registering with:', { email, name, birthDate, sex });
      router.replace('/(tabs)/home');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Email:</ThemedText>
      <TextInput
        style={[
          styles.input,
          { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text },
        ]}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <ThemedText style={styles.label}>Name:</ThemedText>
      <TextInput
        style={[
          styles.input,
          { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text },
        ]}
        onChangeText={setName}
        value={name}
      />
      <ThemedText style={styles.label}>Birth Date:</ThemedText>
      <TextInput
        style={[
          styles.input,
          { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text },
        ]}
        onChangeText={setBirthDate}
        value={birthDate}
        placeholder="YYYY-MM-DD"
      />
      <ThemedText style={styles.label}>Sex (F/M):</ThemedText>
      <TextInput
        style={[
          styles.input,
          { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text },
        ]}
        onChangeText={setSex}
        value={sex}
        maxLength={1}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
