
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const handleSend = () => {
    // OpenAI API call will be here
    setMessages([...messages, { text: message, sender: 'user' }]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setMessage}
          value={message}
          placeholder="Chat with the Wise One..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
  },
});

export default ChatScreen;
