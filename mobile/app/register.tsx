
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const RegistrationScreen = () => {
  const { colorScheme } = useColorScheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // Handle registration logic here
    console.log('Registering with:', { email, name, birthDate, sex });
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Email:</Text>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text }]}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Name:</Text>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text }]}
        onChangeText={setName}
        value={name}
      />
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Birth Date:</Text>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text }]}
        onChangeText={setBirthDate}
        value={birthDate}
        placeholder="YYYY-MM-DD"
      />
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Sex (F/M):</Text>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text }]}
        onChangeText={setSex}
        value={sex}
        maxLength={1}
      />
      <Button title="Register" onPress={handleRegister} color={Colors[colorScheme].tint} />
    </View>
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
  },
});

export default RegistrationScreen;
