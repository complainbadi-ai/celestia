
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { MessageBubble } from '@/components/message-bubble';
import { MessageInput } from '@/components/message-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const ChatScreen = () => {
  const colorScheme = useColorScheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Initial message from the AI
    setMessages([
      { text: 'Welcome to the Wise One! I am here to help you.', sender: 'ai' },
    ]);
  }, []);

  const handleSend = async () => {
    if (message.trim() === '') return;

    const newMessage = { text: message, sender: 'user' };
    setMessages([...messages, newMessage]);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth token here
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const aiMessage = { text: data.reply, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, something went wrong.', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90} // Adjust this value as needed
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <ThemedView style={styles.header}>
            <IconSymbol name="brain.head.profile" size={120} color={Colors[colorScheme ?? 'light'].tint} />
          </ThemedView>
        }>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>Chat with the Wise One</ThemedText>
          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <MessageInput value={message} onChangeText={setMessage} onSend={handleSend} />
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ChatScreen;
