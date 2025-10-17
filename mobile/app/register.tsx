
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const RegistrationScreen = () => {
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
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
      />
      <Text style={styles.label}>Birth Date:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setBirthDate}
        value={birthDate}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>Sex (F/M):</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSex}
        value={sex}
        maxLength={1}
      />
      <Button title="Register" onPress={handleRegister} />
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export default RegistrationScreen;
